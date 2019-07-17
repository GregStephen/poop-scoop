import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';

import userData from '../../helpers/data/userData';

import './MyNavbar.scss';

class MyNavbar extends React.Component {
  state = {
    isOpen: false,
    user: {},
  }

  static propTypes = {
    authed: PropTypes.bool.isRequired,
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.authed !== prevProps.authed) {
      if (this.props.authed) {
        const firebaseId = firebase.auth().currentUser.uid;
        userData.getUserByUID(firebaseId)
          .then((user) => {
            console.error(user);
            this.setState({ user });
          }).catch();
      }
    }
  }

  logMeOut = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  };

  render() {
    const { authed } = this.props;
    const { user } = this.state;
    const buildNavbar = () => {
      if (authed) {
        return (
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="navbar-user-button">
                  <img className="navbar-user-image" src={user.imageUrl} alt="the user"></img>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem header>
                    <div>
                      <p>{user.name}</p>
                      <p>{user.city}</p>
                    </div>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Account Settings
                  </DropdownItem>
                  <DropdownItem onClick={this.logMeOut}>
                      Log Out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
        );
      } return ('');
    };

    return (
      <div className="MyNavbar">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand tag={RRNavLink} to='/home'>PoopScoop</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {buildNavbar()}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MyNavbar;
