import React from 'react';

import Review from '../Review/Review';

import businessData from '../../helpers/data/businessData';
import ratingData from '../../helpers/data/ratingData';

import yelpDataShape from '../../helpers/propz/yelpDataShape';
import './ResultRow.scss';

const businessUndefined = {
  yelpId: 'undefined',
  zip: 'undefined',
  id: 'undefined',
};

const ratingUndefined = [{
  id: 'undefined',
  uid: 'undefined',
  businessId: 'undefined',
  cleanliness: 'undefined',
  decor: 'undefined',
  restroomType: 'undefined',
  review: 'undefined',
  timeStamp: 'undefined',
}];

class ResultRow extends React.Component {
  state = {
    business: businessUndefined,
    reviews: ratingUndefined,
  }

  static propTypes = {
    result: yelpDataShape.yelpDataShape,
  }

  componentDidMount() {
    const { result } = this.props;
    businessData.getBusinessesById(result.id)
      .then((business) => {
        if (business) {
          console.error('business', business);
          this.setState({ business });
          ratingData.getRatingByBusinessId(business.id)
            .then((reviews) => {
              if (reviews.length > 0) {
                console.error('reviews', reviews);
                this.setState({ reviews });
              }
            });
        }
      });
  }

  render() {
    const { result } = this.props;
    const { reviews } = this.state;
    const reviewDisplay = (reviewsArray) => {
      const firstReview = reviewsArray[0];
      console.error('first', firstReview);
      return (
      <Review key={ firstReview.id } review={ firstReview.review }/>
      );
    };

    return (
      <li className="ResultRow">
        {result.name}
        { reviewDisplay(reviews) }
      </li>
    );
  }
}

export default ResultRow;
