import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Review.scss';

class Review extends React.Component {
  static propTypes = {
    review: PropTypes.string.isRequired,
    restroomType: PropTypes.string.isRequired,
    reviewer: PropTypes.object.isRequired,
    bizLink: PropTypes.string.isRequired,
    bizSearch: PropTypes.string.isRequired,
  }

  showReview = () => {
    const {
      review,
      bizLink,
      bizSearch,
      reviewer,
      restroomType,
      restroomTypes,
    } = this.props;
    if (review === 'undefined') {
      return (
      <p>No Reviews Yet...
        <Link to={{ pathname: bizLink, search: bizSearch }}>Be the first!</Link>
      </p>);
    }
    const userLink = `/user/${reviewer.id}`;
    const restroom = restroomTypes.filter(bathroom => bathroom.id === restroomType);
    return (
      <div>
      <p>"{review}" -<Link to={{ pathname: userLink }}>{reviewer.name}</Link></p>
      <p>on their {restroom[0].restroomType} restroom</p>
      </div>
    );
  };

  render() {
    return (
      <div className="Review">
        {this.showReview()}
      </div>
    );
  }
}

export default Review;
