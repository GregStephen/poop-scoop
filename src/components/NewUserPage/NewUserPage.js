import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

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
    newUser: defaultUser,
  }

  formSubmit = (e) => {
    e.preventDefault();
    const dateCreated = moment();
    console.error('dateCreated', dateCreated);
    const saveMe = { ...this.state.newUser };
    saveMe.uid = firebase.auth().currentUser.uid;
    saveMe.dateCreated = dateCreated;
    userData.postUser(saveMe)
      .then(() => this.props.history.push('/home'))
      .catch(err => console.error('unable to save', err));
  }

  formFieldStringState = (e) => {
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.value;
    this.setState({ newUser: tempUser });
  }

  render() {
    const { newUser } = this.state;
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
          <div className="form-group">
            <label htmlFor="imageUrl">Image</label>
            <input
            type="url"
            className="form-control"
            id="imageUrl"
            value={newUser.imageUrl}
            onChange={this.formFieldStringState}
            placeholder="www.linkToMyPicture.com"
            required
            />
          </div>
          <button type="submit" className="btn btn-primary">Join PoopScoop</button>
        </form>
      </div>
    );
  }
}

export default NewUserPage;
