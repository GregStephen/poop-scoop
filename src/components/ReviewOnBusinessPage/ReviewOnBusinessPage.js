import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';

import './ReviewOnBusinessPage.scss';

class ReviewOnBusinessPage extends React.Component {
  static propTypes = {
    review: PropTypes.object,
    restroomTypes: PropTypes.array,
    deleteReview: PropTypes.func,
    yelpId: PropTypes.string,
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
    const bizLink = `/edit-review/${yelpId}`;
    const bizSearch = `?biz=${review.businessId}&review=${review.id}`;
    return (
      <div className="ReviewOnBusinessPage">
        <p>"{review.review}"</p>
        { this.showRestroomType() }
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
