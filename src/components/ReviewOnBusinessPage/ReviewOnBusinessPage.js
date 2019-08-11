/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';

import forWhichBathroom from '../../helpers/forWhichBathroom';
import createStars from '../../helpers/createStars';

import userData from '../../helpers/data/userData';

import './ReviewOnBusinessPage.scss';

class ReviewOnBusinessPage extends React.Component {
  static propTypes = {
    review: PropTypes.object,
    restroomTypes: PropTypes.array,
    deleteReview: PropTypes.func,
    yelpId: PropTypes.string,
  }

  state = {
    user: {},
  }

  componentDidMount() {
    userData.getUserByUID(this.props.review.uid)
      .then(user => this.setState({ user }))
      .catch();
  }

  deleteThisReview = (e) => {
    const { deleteReview, review } = this.props;
    e.preventDefault();
    const { id } = review;
    deleteReview(id);
  }

  editThisReview = (e) => {
    e.preventDefault();
  }

  render() {
    const { review, yelpId, restroomTypes } = this.props;
    const { user } = this.state;
    const bizLink = `/edit-review/${yelpId}`;
    const bizSearch = `?biz=${review.businessId}&review=${review.id}`;
    const userLink = `/user/${user.id}`;

    return (
      <div className="ReviewOnBusinessPage col-12 col-md-10 col-lg-8 col-xl-6">
      <div className="card">
        <p>"{review.review}"</p>
        <Link to={{ pathname: userLink }}>- {user.name}</Link>
        { forWhichBathroom(restroomTypes, review) }
        <p>Cleanliness: {createStars(review.cleanliness)}</p>
        <p>Decor: {createStars(review.decor)}</p>
        { review.uid === firebase.auth().currentUser.uid
          ? <div>
            <button className="btn btn-sm btn-danger" onClick={this.deleteThisReview}>Delete</button>
            <Link className="btn btn-sm btn-info" to={{ pathname: bizLink, search: bizSearch }}>Edit</Link>

          </div>
          : ''
        }
        </div>
      </div>
    );
  }
}

export default ReviewOnBusinessPage;
