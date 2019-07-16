import React from 'react';
import { Link } from 'react-router-dom';
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
    changingTables: [],
    unisexTables: [],
    maleTables: [],
    femaleTables: [],
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
        const unisexRatings = [];
        const unisexRatingsMatch = reviews.filter(review => review.restroomType === type.id);
        unisexRatingsMatch.forEach((match) => {
          const justRatings = ((match.decor + match.cleanliness) / 2);
          unisexRatings.push(justRatings);
        });
        this.setState({ unisexRatings });
      } else if (type.id === 'restroom1') {
        const maleRatings = [];
        const maleRatingsMatch = reviews.filter(review => review.restroomType === type.id);
        maleRatingsMatch.forEach((match) => {
          const justRatings = ((match.decor + match.cleanliness) / 2);
          maleRatings.push(justRatings);
        });
        this.setState({ maleRatings });
      } else if (type.id === 'restroom2') {
        const femaleRatings = [];
        const femaleRatingsMatch = reviews.filter(review => review.restroomType === type.id);
        femaleRatingsMatch.forEach((match) => {
          const justRatings = ((match.decor + match.cleanliness) / 2);
          femaleRatings.push(justRatings);
        });
        this.setState({ femaleRatings });
      }
    });
  };

  seperateChangingTables = () => {
    const { changingTables } = this.state;
    const { restroomTypes } = this.props;
    restroomTypes.forEach((type) => {
      if (type.id === 'restroom0') {
        const unisexTables = changingTables.filter(table => table.restroomType === type.id);
        this.setState({ unisexTables });
      } else if (type.id === 'restroom1') {
        const maleTables = changingTables.filter(table => table.restroomType === type.id);
        this.setState({ maleTables });
      } else if (type.id === 'restroom2') {
        const femaleTables = changingTables.filter(table => table.restroomType === type.id);
        this.setState({ femaleTables });
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
                const changingTables = amenities.filter(amenity => amenity.type === 'type0');
                this.setState({ changingTables });
                this.seperateChangingTables();
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
    const {
      business,
      reviews,
      unisexRatings,
      maleRatings,
      femaleRatings,
      maleTables,
      femaleTables,
      unisexTables,
    } = this.state;
    const bizLink = `/business/${result.id}`;
    const bizSearch = `?biz=${business.id}`;
    const reviewDisplay = (reviewsArray) => {
      const firstReview = reviewsArray[0];
      return (
      <Review key={ firstReview.id } review={ firstReview.review }/>
      );
    };

    const ratingDisplay = (unisexRatingsArray, maleRatingsArray, femaleRatingsArray) => {
      let unisexRating = '';
      let maleRating = '';
      let femaleRating = '';
      if (unisexRatingsArray.length > 0) {
        unisexRating = this.ratingMath(unisexRatingsArray);
      } else {
        unisexRating = 'No Rating';
      }
      if (maleRatingsArray.length > 0) {
        maleRating = this.ratingMath(maleRatingsArray);
      } else {
        maleRating = 'No Rating';
      }
      if (femaleRatingsArray.length > 0) {
        femaleRating = this.ratingMath(femaleRatingsArray);
      } else {
        femaleRating = 'No Rating';
      }
      return (
        <div className='col-12 row'>
          <p className='unisexRating col-4'>{unisexRating}</p>
          <p className='maleRating col-4'>{maleRating}</p>
          <p className='femaleRating col-4'>{femaleRating}</p>
        </div>
      );
    };

    const changingTableDisplay = (uniTables, mTables, fTables) => (
        <div className='col-12 row'>
          <p className="col">Changing Tables: </p>
          <p className="col">{uniTables.length > 0 ? `${uniTables[0].status}` : 'Unknown'}</p>
          <p className="col">{mTables.length > 0 ? `${mTables[0].status}` : 'Unknown'}</p>
          <p className="col">{fTables.length > 0 ? `${fTables[0].status}` : 'Unknown'}</p>
        </div>
    );

    return (
      <div className="ResultRow col-12 mb-2">
      <div className="card">
        <div className="row no-gutters">
          <div className="col-md-4">
            <img className="result-image img-fluid" src={result.photos[0]} alt={result.name}></img>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <Link to={{ pathname: bizLink, search: bizSearch }}><h2 className="card-title">{result.name}</h2></Link>
              <p>{result.location.address1}</p>
              { reviewDisplay(reviews) }
              <div className='container'>
              { ratingDisplay(unisexRatings, maleRatings, femaleRatings) }
              </div>
              <div className='container'>
                { changingTableDisplay(unisexTables, maleTables, femaleTables)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default ResultRow;
