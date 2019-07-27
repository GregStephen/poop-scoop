import React from 'react';
import {
  Form, FormGroup, Label, Input, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';

class EditUserModalForm extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    toggleUserEdit: PropTypes.func.isRequired,
    updateTheUser: PropTypes.func.isRequired,
  }

  state = {
    updatedUser: {
      name: '',
      city: '',
      state: '',
    },
  }

  componentDidMount() {
    this.setState({ updatedUser: this.props.user });
  }

  toggleModal = () => {
    const { toggleUserEdit } = this.props;
    toggleUserEdit();
  }

  formFieldStringState = (e) => {
    const tempUser = { ...this.state.updatedUser };
    tempUser[e.target.id] = e.target.value;
    this.setState({ updatedUser: tempUser });
  }

  handleUpdatedUserSubmit = (e) => {
    e.preventDefault();
    const { updateTheUser } = this.props;
    const { updatedUser } = this.state;
    const saveUpdatedUser = { ...updatedUser };
    updateTheUser(saveUpdatedUser);
    this.toggleModal();
  }

  render() {
    const { updatedUser } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleUpdatedUserSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name:</Label>
              <Input type="input" name="name" id="name" value={updatedUser.name} onChange={this.formFieldStringState} required/>
            </FormGroup>
            <FormGroup>
              <Label for="city">City:</Label>
              <Input type="input" name="city" id="city" value={updatedUser.city} onChange={this.formFieldStringState} required/>
            </FormGroup>
            <FormGroup>
              <Label for="state">State:</Label>
              <Input type="input" name="state" id="state" value={updatedUser.state} onChange={this.formFieldStringState} required/>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
         <Button type="submit" color="primary">Edit Yourself</Button>{' '}
         <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
       </ModalFooter>
        </Form>
      </div>
    );
  }
}

export default EditUserModalForm;
