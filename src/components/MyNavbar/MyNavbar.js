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

// import userData from '../../helpers/data/userData';

import './MyNavbar.scss';
import userData from '../../helpers/data/userData';

// const defaultUser = {
//   id: '',
//   name: '',
//   city: '',
//   state: '',
//   imageUrl: '',
// };

class MyNavbar extends React.Component {
  state = {
    isOpen: false,
    // user: defaultUser,
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

  // componentDidMount() {
  //   const { authed } = this.props;
  //   if (authed) {
  //     const firebaseId = firebase.auth().currentUser.uid;
  //     userData.getUserByUID(firebaseId)
  //       .then((user) => {
  //         this.setState({ user });
  //       }).catch(err => console.error('trouble fetching user on navbar mount', err));
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.authed !== prevProps.authed) {
  //     if (this.props.authed) {
  //       const firebaseId = firebase.auth().currentUser.uid;
  //       userData.getUserByUID(firebaseId)
  //         .then((user) => {
  //           this.setState({ user });
  //         }).catch(err => console.error('trouble fetching user on navbar update', err));
  //     } else {
  //       this.setState({ user: defaultUser });
  //     }
  //   }
  // }

  logMeOut = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  };

  render() {
    // const { user } = this.state;
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
                    <p>{userObj.city}</p>
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
        <Navbar expand="md">
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
