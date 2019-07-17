import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

import './Auth.scss';

class Auth extends React.Component {
  state = {
    email: '',
    password: '',
  }

  logIntoPoopScoop = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.history.push('/home');
      }).catch();
  }

  // logIn = (e) => {
  //   e.preventDefault();
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithPopup(provider)
  //     .then(() => {
  //       const firebaseId = firebase.auth().currentUser.uid;
  //       userData.getUserByUID(firebaseId)
  //         .then((resp) => {
  //           if (resp === undefined) {
  //             console.error('new User');
  //             this.props.history.push('/new-user');
  //           } else {
  //             this.props.history.push('/home');
  //           }
  //         });
  //     });
  // };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    const { email, password } = this.state;
    return (
      <div>
        <h1>Welcome to PoopScoop!</h1>
        <form onSubmit={this.logIntoPoopScoop}>
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
          <button className="btn btn-success">Log In</button>
        </form>
        <Link className="btn btn-info" to={'/new-user'}>Create an Account!</Link>
      </div>
    );
  }
}

export default Auth;
