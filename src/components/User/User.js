import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import {
  Modal, ModalHeader, Button, Collapse, Card, CardBody,
} from 'reactstrap';

import SingleReview from '../SingleReview/SingleReview';
import EditUserModalForm from '../EditUserModalForm/EditUserModalForm';

import avatarData from '../../helpers/data/avatarData';
import userData from '../../helpers/data/userData';
import reviewData from '../../helpers/data/ratingData';
import restroomTypeData from '../../helpers/data/restroomTypeData';

import './User.scss';

class User extends React.Component {
  state = {
    user: {},
    reviews: [],
    restroomTypes: [],
    editUserModal: false,
    collapse: false,
    status: 'Closed',
    avatars: [],
    avatarChoice: '',
  }

  onEntering = () => {
    this.setState({ status: 'Opening...' });
  }

  onEntered = () => {
    this.setState({ status: 'Opened' });
  }

  onExiting = () => {
    this.setState({ status: 'Closing...' });
  }

  onExited = () => {
    this.setState({ status: 'Closed' });
  }

  toggle = () => {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  getUserInfo = () => {
    const userId = this.props.match.params.id;
    userData.getUserById(userId)
      .then((userPromise) => {
        this.setState({ user: userPromise.data });
        this.setState({ avatarChoice: this.state.user.imageUrl });
        reviewData.getRatingByUserId(this.state.user.uid)
          .then((reviewArray) => {
            this.setState({ reviews: reviewArray });
          });
      })
      .catch(err => console.error('problem getting single user', err));
  }

  loadPage = () => {
    this.getUserInfo();
    restroomTypeData.getRestroomType()
      .then(restroomTypes => this.setState({ restroomTypes }))
      .catch();
    avatarData.getAvatars()
      .then(avatars => this.setState({ avatars }))
      .catch(err => console.error('trouble getting avatars', err));
  }

  componentDidMount() {
    this.loadPage();
  }

  toggleUserEdit = () => {
    this.setState(prevState => ({
      editUserModal: !prevState.editUserModal,
    }));
  }

  updateTheUser = (userObj) => {
    const { userFunc } = this.props;
    const userId = this.props.match.params.id;
    userFunc(userObj, userId);
    this.setState({ user: userObj });
  }

  deleteProfile = (e) => {
    const userId = this.props.match.params.id;
    const user = firebase.auth().currentUser;
    const { reviews } = this.state;
    e.preventDefault();
    if (reviews.length > 0) {
      console.error('deleted reviews');
      reviews.forEach((review) => {
        reviewData.deleteReviewFromDatabase(review.id);
      });
    }
    userData.deleteUser(userId)
      .then(() => {
        user.delete()
          .then(() => {
            firebase.auth().signOut();
          })
          .catch(err => console.error('trouble deleting user', err));
      })
      .catch(err => console.error('can not delete user', err));
  }

  selectAvatar = (e) => {
    e.preventDefault();
    const avatarSelection = $('.avatar-image');
    for (let i = 0; i < avatarSelection.length; i += 1) {
      avatarSelection[i].classList.remove('selected');
    }
    e.target.classList.add('selected');
    const tempUser = { ...this.state.user };
    tempUser[e.target.id] = this.state.avatarChoice;
    let tempAvatar = this.state.avatarChoice;
    tempAvatar = e.target.src;
    this.setState({ avatarChoice: tempAvatar });
  }

  createAvatarSelection = () => {
    const { avatars } = this.state;
    const avatarSelection = [];
    Object.keys(avatars).forEach((key, index) => {
      avatarSelection.push(<div key={key}className="avatar col-5 col-md-2 mb-4">
      <button><img id='imageUrl' className={ index === 0 ? 'avatar-image selected' : 'avatar-image'} src={avatars[key]} alt={key} onClick={this.selectAvatar}></img></button>
      </div>);
    });
    return avatarSelection;
  };

  saveNewAvatar = () => {
    const userId = this.props.match.params.id;
    const { userFunc } = this.props;
    const { avatarChoice, user } = this.state;
    userFunc(user, userId);
    userData.changeAvatar(avatarChoice, userId)
      .then(() => {
        this.loadPage();
        this.toggle();
      })
      .catch();
  }

  render() {
    const { user, reviews, restroomTypes } = this.state;
    const displayReviews = reviews.map(review => (
        <SingleReview key={review.id} review={review} restroomTypes={restroomTypes}/>
    ));


    return (
      <div className="User row">
        <div className="name col-12">
          <h1>{user.name}</h1>
        </div>
        <div className="avatar-div col-3">
          <img className="user-avatar" src={user.imageUrl} alt="User's avatar"></img>
        </div>
        <div>
          <p>Pooper since: {user.dateCreated}</p>
          <p>Number of reviews: {reviews.length}</p>
          <p>{user.city}, {user.state}</p>
          {firebase.auth().currentUser.uid === user.uid ? <button className="btn btn-info" onClick={this.toggleUserEdit}>Edit Profile</button> : ''}
          {firebase.auth().currentUser.uid === user.uid ? <button className="btn btn-danger" onClick={this.deleteProfile}>Delete Profile</button> : ''}
        </div>
        <div className="col-12">
        {firebase.auth().currentUser.uid === user.uid
          ? <div className="col-12 row justify-content-start">
        <Button className="col-auto offset-1 mt-4" color="primary" onClick={this.toggle}>Edit Avatar</Button>
        <Collapse
          isOpen={this.state.collapse}
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <div className="row justify-content-center">
          <Card className="col-10 avatar-selector">
            <CardBody className="col-12 row justify-content-around">
            { this.createAvatarSelection()}
            <div className="col-12 row justify-content-center">
            <Button className="btn btn-info" onClick={this.saveNewAvatar}>Save New Avatar</Button>
            </div>
            </CardBody>
          </Card>
          </div>
        </Collapse>
      </div> : ''}
      </div>
        <div className="col-12">
          <h1>Ratings</h1>
          <div className="container">
            <div className="row justify-content-center">
             { displayReviews }
            </div>
          </div>
        </div>
        <div>
          <Modal isOpen={this.state.editUserModal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleUserEdit}>Edit Yo Self!</ModalHeader>
            <EditUserModalForm
            toggleUserEdit={this.toggleUserEdit}
            user={user}
            updateTheUser={this.updateTheUser}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default User;
