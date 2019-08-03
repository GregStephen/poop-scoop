import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

import './Auth.scss';

class Auth extends React.Component {
  state = {
    email: '',
    password: '',
    error: '',
  }

  logIntoPoopScoop = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.history.push('/home');
      }).catch(err => this.setState({ error: err.message }));
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    const { email, password, error } = this.state;
    return (
      <div className="Auth container">
        <div className="row">
          <div className="col-12 col-lg-8 welcome-div row justify-content-center">
            <h1 className="welcome-header col-12">Welcome to PoopScoop!</h1>
            <h4 className="col-11 col-md-8">Welcome to the #4 site on the web for
            rating and finding the best bathrooms around!</h4>
            <h4 className="col-11 col-md-8">Need to find the closest changing table?</h4>
            <h4 className="bold col-11 col-md-8">WE GOT YA COVERED</h4>
            <h4 className="col-11 col-md-8">Terrified to go into a urine soaked,
            permanently sticky, wretched smelling bathroom?</h4>
            <h4 className="bold col-11 col-md-8">WE GOT YA COVERED</h4>
            <h4 className="col-11 col-md-8">Excited to get searching?</h4>
            <Link className="btn btn-info col-8" to={'/new-user'}>Create an Account!</Link>
          </div>
          <form className="col-10 col-lg-4 container sign-in-form" onSubmit={this.logIntoPoopScoop}>
          <h3 className="sign-in-header">All Ready Have An Account?</h3>
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
            <p className="error">{error}</p>
          </form>
        </div>
      </div>
    );
  }
}

export default Auth;
