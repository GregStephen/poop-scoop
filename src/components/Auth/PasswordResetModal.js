import React from 'react';
import {
  Form, ModalBody, Label, Input, ModalFooter, Button,
} from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';

import './PasswordResetModal.scss';

class PasswordResetModal extends React.Component {
  state={
    email: '',
  }

  toggleModal = () => {
    const { toggleResetPasswordModal } = this.props;
    toggleResetPasswordModal();
  }

  resetPassword = (e) => {
    e.preventDefault();
    const userEmail = this.state.email;
    firebase.auth().sendPasswordResetEmail(userEmail)
      .then(() => {
        this.toggleModal();
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 'auth/user-not-found') {
          this.setState({ error: 'Sorry, we have no record of that email' });
        }
        if (err.code === 'auth/invalid-email') {
          this.setState({ error: err.message });
        }
      });
  }

  formFieldStringState = (e) => {
    const tempEmail = e.target.value;
    this.setState({ email: tempEmail });
  }

  render() {
    return (
      <div>
      <Form onSubmit={this.resetPassword}>
        <ModalBody>
        <p>An email will be sent for you to reset your password</p>
        <Label for="email">Enter Your Email:</Label>
          <Input
          type="email"
          id="email"
          value={this.state.email}
          onChange={this.formFieldStringState}
          required
          >
          </Input>
          <p className="error">{this.state.error}</p>
        </ModalBody>
        <ModalFooter>
         <Button type="submit" color="primary">Send Email</Button>{' '}
         <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
       </ModalFooter>
       </Form>
      </div>
    );
  }
}

export default PasswordResetModal;
