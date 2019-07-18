import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import SingleReview from '../SingleReview/SingleReview';
import userData from '../../helpers/data/userData';
import reviewData from '../../helpers/data/ratingData';
import restroomTypeData from '../../helpers/data/restroomTypeData';

import './User.scss';

class User extends React.Component {
  state = {
    user: {},
    reviews: [],
    restroomTypes: [],
  }

  componentDidMount() {
    const userId = this.props.match.params.id;
    userData.getUserById(userId)
      .then((userPromise) => {
        this.setState({ user: userPromise.data });
        reviewData.getRatingByUserId(userId)
          .then((reviewArray) => {
            this.setState({ reviews: reviewArray });
          });
      })
      .catch(err => console.error('problem getting single user', err));
    restroomTypeData.getRestroomType()
      .then(restroomTypes => this.setState({ restroomTypes }))
      .catch();
  }

  deleteProfile = (e) => {
    const userId = this.props.match.params.id;
    e.preventDefault();
    userData.deleteUser(userId)
      .then(() => {
        firebase.auth().signOut();
        this.props.history.push('/auth');
      })
      .catch(err => console.error('can not delete user', err));
  }

  render() {
    const { user, reviews, restroomTypes } = this.state;
    const displayReviews = reviews.map(review => (
        <SingleReview key={review.id} review={review} restroomTypes={restroomTypes}/>
    ));


    return (
      <div className="User">
        <h1>{user.name}</h1>
        <img src={user.imageUrl} alt="user smiling at ya"></img>
        <p>Number of reviews: {reviews.length}</p>
        <p>{user.city}</p>
        <p>{user.state}</p>
        {firebase.auth().currentUser.uid === user.uid ? <button className="btn btn-info">Edit Profile</button> : ''}
        {firebase.auth().currentUser.uid === user.uid ? <button className="btn btn-danger" onClick={this.deleteProfile}>Delete Profile</button> : ''}
        <div>
          <h1>Ratings</h1>
        { displayReviews }
        </div>
      </div>
    );
  }
}

export default User;
