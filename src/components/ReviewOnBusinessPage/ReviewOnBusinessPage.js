import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';

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

  showRestroomType = (e) => {
    const { restroomTypes, review } = this.props;
    restroomTypes.forEach(type => (type.id === review.restroomType ? <div><p>{type.restroomType}</p></div> : ''));
  }

  deleteThisReview = (e) => {
    const { deleteReview, review } = this.props;
    e.preventDefault();
    const { id } = review;
    deleteReview(id);
  }

  editThisReview = (e) => {
    e.preventDefault();
    console.error('edit!');
  }

  render() {
    const { review, yelpId } = this.props;
    const { user } = this.state;
    const bizLink = `/edit-review/${yelpId}`;
    const bizSearch = `?biz=${review.businessId}&review=${review.id}`;
    const userLink = `/user/${user.id}`;

    return (
      <div className="ReviewOnBusinessPage">
        <p>"{review.review}"</p>
        <Link to={{ pathname: userLink }}>- {user.name}</Link>
        { this.showRestroomType() }
        <p>Cleanliness: {createStars(review.cleanliness)}</p>
        <p>Decor: {createStars(review.decor)}</p>
        { review.uid === firebase.auth().currentUser.uid
          ? <div>
            <button className="btn btn-danger" onClick={this.deleteThisReview}>Delete</button>
            <Link className="btn btn-info" to={{ pathname: bizLink, search: bizSearch }}>Edit</Link>

          </div>
          : ''
        }
      </div>
    );
  }
}

export default ReviewOnBusinessPage;
