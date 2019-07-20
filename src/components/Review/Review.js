import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Review extends React.Component {
  static propTypes = {
    review: PropTypes.string.isRequired,
  }

  showReview = () => {
    const { review, bizLink, bizSearch } = this.props;
    if (review === 'undefined') {
      return (
      <p>No Reviews Yet!
        <Link to={{ pathname: bizLink, search: bizSearch }}>Be the first!</Link>
      </p>);
    }
    return (
      <p>"{review}"</p>
    );
  };

  render() {
    // const { review } = this.props;
    return (
      <div className="Review">
        {this.showReview()}
      </div>
    );
  }
}

export default Review;
