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

import userData from '../../helpers/data/userData';

import './MyNavbar.scss';

const defaultUser = {
  id: '',
  name: '',
  city: '',
  state: '',
  imageUrl: '',
};

class MyNavbar extends React.Component {
  state = {
    isOpen: false,
    user: defaultUser,
  }

  static propTypes = {
    authed: PropTypes.bool.isRequired,
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  componentDidMount() {
    const { authed } = this.props;
    if (authed) {
      const firebaseId = firebase.auth().currentUser.uid;
      userData.getUserByUID(firebaseId)
        .then((user) => {
          this.setState({ user });
        }).catch();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.authed !== prevProps.authed) {
      if (this.props.authed) {
        const firebaseId = firebase.auth().currentUser.uid;
        userData.getUserByUID(firebaseId)
          .then((user) => {
            this.setState({ user });
          }).catch();
      } else {
        this.setState({ user: defaultUser });
      }
    }
  }

  logMeOut = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  };

  render() {
    const { user } = this.state;
    const { authed } = this.props;
    const buildNavbar = () => {
      let userLink = '';
      if (user !== undefined) {
        userLink = `/user/${user.id}`;
      }
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
                  <Link to={userLink}>Account Settings</Link>
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
