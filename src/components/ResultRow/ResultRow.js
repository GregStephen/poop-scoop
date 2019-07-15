import React from 'react';
import PropTypes from 'prop-types';

import Review from '../Review/Review';

import businessData from '../../helpers/data/businessData';
import ratingData from '../../helpers/data/ratingData';
import amenityData from '../../helpers/data/amenityData';

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
    amenities: [],
    maleRatings: [],
    femaleRatings: [],
    unisexRatings: [],
  }

  static propTypes = {
    result: yelpDataShape.yelpDataShape,
    restroomTypes: PropTypes.array.isRequired,
    amenityTypes: PropTypes.object.isRequired,
  }

  seperateRatings = () => {
    const { reviews } = this.state;
    const { restroomTypes } = this.props;
    restroomTypes.forEach((type) => {
      if (type.id === 'restroom0') {
        const unisexRatings = reviews.filter(review => review.restroomType === type.id);
        this.setState({ unisexRatings });
      } else if (type.id === 'restroom1') {
        const maleRatings = reviews.filter(review => review.restroomType === type.id);
        this.setState({ maleRatings });
      } else if (type.id === 'restroom2') {
        const femaleRatings = reviews.filter(review => review.restroomType === type.id);
        this.setState({ femaleRatings });
      }
    });
  };

  componentDidMount() {
    const { result } = this.props;
    businessData.getBusinessesById(result.id)
      .then((business) => {
        if (business) {
          this.setState({ business });
          ratingData.getRatingByBusinessId(business.id)
            .then((reviews) => {
              if (reviews.length > 0) {
                this.setState({ reviews });
                this.seperateRatings();
              }
            });
          amenityData.getAmenitiesByBusinessId(business.id)
            .then((amenities) => {
              if (amenities.length > 0) {
                this.setState({ amenities });
              }
            });
        }
      });
  }

  ratingMath = (ratings) => {
    const total = ratings.reduce((acc, c) => acc + c, 0);
    return total / ratings.length;
  };

  render() {
    const { result } = this.props;
    const { reviews } = this.state;

    const reviewDisplay = (reviewsArray) => {
      const firstReview = reviewsArray[0];

      return (
      <Review key={ firstReview.id } review={ firstReview.review }/>
      );
    };

    return (
      <div className="ResultRow col-12 mb-2">
      <div className="card">
        <div className="row no-gutters">
          <div className="col-md-4">
            <img className="result-image img-fluid" src={result.photos[0]} alt={result.name}></img>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h2 className="card-title">{result.name}</h2>
              <p>{result.location.address1}</p>
              { reviewDisplay(reviews) }
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default ResultRow;
