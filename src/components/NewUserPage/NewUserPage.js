import React from 'react';
import $ from 'jquery';
import firebase from 'firebase/app';
import 'firebase/auth';

import avatarData from '../../helpers/data/avatarData';
import userData from '../../helpers/data/userData';
import './NewUserPage.scss';

const moment = require('moment');

const defaultUser = {
  city: '',
  dateCreated: '',
  imageUrl: '',
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
  }

  componentDidMount() {
    avatarData.getAvatars()
      .then(avatars => this.setState({ avatars }))
      .catch(err => console.error('trouble getting avatars', err));
  }

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
      .catch(err => console.error('trouble logging in with email', err));
  }

  formFieldStringState = (e) => {
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.value;
    this.setState({ newUser: tempUser });
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
      avatarSelection.push(<div className="avatar col-3 mb-4">
      <button className="avatar-btn"><img id='imageUrl' className={ index === 0 ? 'avatar-image selected' : 'avatar-image'} src={avatars[key]} alt={key} onClick={this.selectAvatar}></img></button>
      </div>);
    });
    return avatarSelection;
  };

  render() {
    const { newUser, email, password } = this.state;
    return (
      <div className="NewUserPage">
        <h1>JOIN US!</h1>
        <form onSubmit={this.formSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
            type="text"
            className="form-control"
            id="name"
            value={newUser.name}
            onChange={this.formFieldStringState}
            placeholder="John"
            required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={this.handleChange}
            placeholder="John@PoopScoop.com"
            required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={this.handleChange}
            required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
            type="text"
            className="form-control"
            id="city"
            value={newUser.city}
            onChange={this.formFieldStringState}
            placeholder="Nashville"
            required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
            type="text"
            className="form-control"
            id="state"
            value={newUser.state}
            onChange={this.formFieldStringState}
            placeholder="TN"
            required
            />
          </div>
          <div className="form-group justify-content-center">
            <p>Select Your Avatar</p>
            <div className="row col-10 ">
              { this.createAvatarSelection()}
            </div>
          </div>
          <button type="submit" className="new-user-btn btn btn-primary">Join PoopScoop</button>
        </form>
      </div>
    );
  }
}

export default NewUserPage;
