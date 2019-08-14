import React from 'react';
import {
  Form, ModalBody, Label, Input, ModalFooter, Button,
} from 'reactstrap';

class PasswordResetModal extends React.Component {
  state={
    email: '',
  }

  toggleModal = () => {
    const { toggleResetPasswordModal } = this.props;
    toggleResetPasswordModal();
  }

  formFieldStringState = (e) => {
    const tempEmail = e.target.value;
    this.setState({ email: tempEmail });
  }

  render() {
    return (
      <div>
      <Form>
        <ModalBody>
        <Label for="email">Enter Your Email:</Label>
          <Input
          type="email"
          id="email"
          value={this.state.email}
          onChange={this.formFieldStringState}
          required
          >
          </Input>
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
