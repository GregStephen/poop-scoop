import React from 'react';
import {
  Form, FormGroup, Label, Input, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';

import stateData from '../../helpers/data/stateData';
import cityData from '../../helpers/data/cityData';

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
    stateList: [],
    cities: [],
  }

  componentDidMount() {
    this.setState({ updatedUser: this.props.user });
    stateData.getStates()
      .then(stateList => this.setState({ stateList }))
      .catch(err => console.error('trouble getting states', err));
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

  stateList = () => {
    const { stateList } = this.state;
    const options = stateList.map(state => (
      <option key={state} value={state}>{state}</option>
    ));
    options.unshift(<option key='pick not' value="">State</option>);
    return options;
  }

  setCities = () => {
    const { updatedUser } = this.state;
    const selectedState = updatedUser.state;
    cityData.getCities(selectedState)
      .then((cities) => {
        this.setState({ cities });
      })
      .catch(err => console.error('cities not found', err));
  }

  cityList = () => {
    this.setCities();
    const citiesList = this.state.cities;
    const options = citiesList.map(city => (
          <option key={city} value={city}>{city}</option>
    ));
    return options;
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
              <Label for="state">State:</Label>
              <Input
              type="select"
              className="form-control"
              id="state"
              value={updatedUser.state}
              onChange={this.formFieldStringState}
              required
              >
              {this.stateList()}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
              type="select"
              className="form-control"
              id="city"
              value={updatedUser.city}
              onChange={this.formFieldStringState}
              required
              >
              {updatedUser.state === '' ? <option value="">Select A State First</option>
                : this.cityList()}
              </Input>
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
