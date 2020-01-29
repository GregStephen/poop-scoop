import React from 'react';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
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

import './MyNavbar.scss';

class MyNavbar extends React.Component {
  state = {
    isOpen: false,
  }

  static propTypes = {
    authed: PropTypes.bool.isRequired,
    userObj: PropTypes.object,
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  logMeOut = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  };


  render() {
    const { authed, userObj, getUser } = this.props;
    const buildNavbar = () => {
      let userLink = '';
      if (userObj !== undefined) {
        userLink = `/user/${userObj.id}`;
      }
      if (userObj === 'undefined' || userObj === undefined) {
        getUser();
      }
      if (authed && userObj !== undefined) {
        return (
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="navbar-user-button">
                <img className="navbar-user-image" src={userObj.imageUrl} alt="the user"></img>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header>
                  <div>
                    <p>{userObj.name}</p>
                    <p>{userObj.city}, {userObj.state}</p>
                  </div>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={Link} to={userLink}>
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
        <Navbar dark color="dark" expand="md">
          <NavbarBrand className="navbar-brand" tag={RRNavLink} to='/home'>PoopScoop</NavbarBrand>
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
