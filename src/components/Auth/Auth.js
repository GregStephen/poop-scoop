import React from 'react';
import { Link } from 'react-router-dom';
import {
  Modal, ModalHeader,
} from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';

import PasswordResetModal from './PasswordResetModal';
import './Auth.scss';

class Auth extends React.Component {
  state = {
    email: '',
    password: '',
    error: '',
    passwordResetModal: false,
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

  toggleResetPasswordModal = () => {
    this.setState(prevState => ({
      passwordResetModal: !prevState.passwordResetModal,
    }));
  }

  render() {
    const { email, password, error } = this.state;
    return (
      <div className="Auth container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 welcome-div row justify-content-center">
            <h1 className="welcome-header col-12">Welcome to PoopScoop!</h1>
            <h4 className="col-12 col-md-8">Welcome to the #2 site on the web for
            rating and finding the best bathrooms around!</h4>
            <h4 className="col-12 col-md-8">Need to find the closest changing table?</h4>
            <h4 className="bold col-12 col-md-8">WE GOT YA COVERED</h4>
            <h4 className="col-12 col-md-8">Terrified to go into a urine soaked,
            permanently sticky, wretched smelling bathroom?</h4>
            <h4 className="bold col-12 col-md-8">WE GOT YA COVERED</h4>
            <h4 className="col-12 col-md-8">Excited to get searching?</h4>
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
              <small className="form-text text-muted">
               <button type="button" className="forgotPasswordBtn" onClick={this.toggleResetPasswordModal}>Forgot Your Password?</button>
              </small>
            </div>
            <button type="submit" className="btn btn-success">Log In</button>
            <p className="error">{error}</p>
          </form>
        </div>
          <div>
          <Modal isOpen={this.state.passwordResetModal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleResetPasswordModal}>Reset Password</ModalHeader>
            <PasswordResetModal
            toggleResetPasswordModal={this.toggleResetPasswordModal}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default Auth;
