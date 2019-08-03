import React from 'react';
import $ from 'jquery';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  Form, Label, Input, Button,
} from 'reactstrap';

import stateData from '../../helpers/data/stateData';
import cityData from '../../helpers/data/cityData';
import avatarData from '../../helpers/data/avatarData';
import userData from '../../helpers/data/userData';
import './NewUserPage.scss';

const moment = require('moment');

const defaultUser = {
  city: '',
  dateCreated: '',
  imageUrl: 'https://image.flaticon.com/icons/svg/1691/1691442.svg',
  name: '',
  state: '',
  uid: '',
};

class NewUserPage extends React.Component {
  state = {
    email: '',
    password: '',
    newUser: defaultUser,
    avatars: [],
    chosenState: '',
    stateList: [],
    cities: [],
    error: '',
  }

  componentDidMount() {
    avatarData.getAvatars()
      .then(avatars => this.setState({ avatars }))
      .catch(err => console.error('trouble getting avatars', err));
    stateData.getStates()
      .then(stateList => this.setState({ stateList }))
      .catch(err => console.error('trouble getting states', err));
  }

  // componentDidUpdate({ prevState }) {
  //   console.error('update');
  //   if (this.state.chosenState !== prevState.chosenState) {
  //     console.error('chosenstate', this.state.chosenState);
  //     cityData.getCities(this.state.chosenState)
  //       .then((cities) => {
  //         this.setState({ cities });
  //       })
  //       .catch(err => console.error('cities not found', err));
  //   }
  // }

  formSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        const dateCreated = moment().format('LL');
        const saveMe = { ...this.state.newUser };
        saveMe.uid = firebase.auth().currentUser.uid;
        saveMe.dateCreated = dateCreated;
        userData.postUser(saveMe)
          .then(() => this.props.history.push('/home'))
          .catch(err => console.error('unable to save', err));
      })
      .catch(err => this.setState({ error: err.message }));
  }

  formFieldStringState = (e) => {
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.value;
    this.setState({ newUser: tempUser });
    if (e.target.id === 'state') {
      this.setState({ chosenState: e.target.value });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  selectAvatar = (e) => {
    e.preventDefault();
    const avatarSelection = $('.avatar-image');
    for (let i = 0; i < avatarSelection.length; i += 1) {
      avatarSelection[i].classList.remove('selected');
    }
    e.target.classList.add('selected');
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.src;
    this.setState({ newUser: tempUser });
  }

  createAvatarSelection = () => {
    const { avatars } = this.state;
    const avatarSelection = [];
    Object.keys(avatars).forEach((key, index) => {
      avatarSelection.push(<div key={index} className="avatar col-6 col-md-4 col-lg-3 mb-4">
      <button className="avatar-btn"><img id='imageUrl' className={ index === 0 ? 'avatar-image selected' : 'avatar-image'} src={avatars[key]} alt={key} onClick={this.selectAvatar}></img></button>
      </div>);
    });
    return avatarSelection;
  };

  stateList = () => {
    const { stateList } = this.state;
    const options = stateList.map(state => (
      <option key={state} value={state}>{state}</option>
    ));
    options.unshift(<option key='pick not' value="">State</option>);
    return options;
  }

  setCities = () => {
    const { newUser } = this.state;
    const selectedState = newUser.state;
    cityData.getCities(selectedState)
      .then((cities) => {
        this.setState({ cities });
      })
      .catch(err => console.error('cities not found', err));
  }

  cityList = () => {
    this.setCities();
    const citiesList = this.state.cities;
    const options = citiesList.map((city, index) => (
          <option key={index} value={city}>{city}</option>
    ));
    return options;
  }

  render() {
    const {
      newUser, email, password, error,
    } = this.state;
    return (
      <div className="NewUserPage container">
        <h1 className="join-header">JOIN US!</h1>
        <Form className="row justify-content-center new-user-form" onSubmit={this.formSubmit}>
          <div className="form-group col-11 col-md-9 col-lg-7">
            <Label for="name">Name</Label>
            <Input
            type="text"
            className="form-control"
            id="name"
            value={newUser.name}
            onChange={this.formFieldStringState}
            placeholder="John"
            required
            />
          </div>
          <div className="form-group col-11 col-md-9 col-lg-7">
            <Label for="email">Email</Label>
            <Input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={this.handleChange}
            placeholder="John@PoopScoop.com"
            required
            />
          </div>
          <div className="form-group col-11 col-md-9 col-lg-7">
            <Label for="password">Password</Label>
            <Input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={this.handleChange}
            required
            />
          </div>
          <div className="city-state col-12 row justify-content-center">
            <div className="form-group col-3 col-md-2">
              <Label for="state">State</Label>
              <Input
              type="select"
              className="form-control"
              id="state"
              value={newUser.state}
              onChange={this.formFieldStringState}
              required
              >
              {this.stateList()}
              </Input>
            </div>
            <div className="form-group col-8 col-md-5">
              <Label for="city">City</Label>
              <Input
              type="select"
              className="form-control"
              id="city"
              value={newUser.city}
              onChange={this.formFieldStringState}
              required
              >
              {newUser.state === '' ? <option value="">Select A State First</option>
                : this.cityList()}
              </Input>
            </div>
          </div>
          <div className="form-group col-12 row justify-content-center">
            <p className="avatar-select-header col-12">Select Your Avatar</p>
            <div className="row col-10 justify-content-around">
              { this.createAvatarSelection()}
            </div>
          </div>
          <h2 className="error col-12">{error}</h2>
          <Button type="submit" className="new-user-btn btn btn-primary btn-lg">Join PoopScoop</Button>
        </Form>
      </div>
    );
  }
}

export default NewUserPage;
