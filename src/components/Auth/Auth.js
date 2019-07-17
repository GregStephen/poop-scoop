import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import userData from '../../helpers/data/userData';
import './Auth.scss';

class Auth extends React.Component {
  logIn = (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(() => {
        const firebaseId = firebase.auth().currentUser.uid;
        userData.getUserByUID(firebaseId)
          .then((resp) => {
            if (resp === undefined) {
              console.error('new User');
              this.props.history.push('/new-user');
            } else {
              this.props.history.push('/home');
            }
          });
      });
  };

  render() {
    return (
      <div>
        <h1>Welcome to PoopScoop!</h1>
        <button onClick={this.logIn}>Create an Account or Log In!</button>
      </div>
    );
  }
}

export default Auth;
