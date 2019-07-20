import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';

import './ReviewOnBusinessPage.scss';

class ReviewOnBusinessPage extends React.Component {
  static propTypes = {
    review: PropTypes.object,
    restroomTypes: PropTypes.array,
    deleteReview: PropTypes.func,
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

  render() {
    const { review } = this.props;
    return (
      <div className="ReviewOnBusinessPage">
        <p>"{review.review}"</p>
        { this.showRestroomType() }
        { review.uid === firebase.auth().currentUser.uid
          ? <button className="btn btn-danger" onClick={this.deleteThisReview}>Delete</button>
          : ''
        }
      </div>
    );
  }
}

export default ReviewOnBusinessPage;
