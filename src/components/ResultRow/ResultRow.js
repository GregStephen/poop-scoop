/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Review from '../Review/Review';

import businessData from '../../helpers/data/businessData';
import ratingData from '../../helpers/data/ratingData';
import amenityData from '../../helpers/data/amenityData';

import ratingMath from '../../helpers/ratingMath';
import createStars from '../../helpers/createStars';

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
    selectBusiness: PropTypes.func.isRequired,
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

  showPopup = () => {
    const { result, selectBusiness } = this.props;
    selectBusiness(result.id);
  }

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
    const bizLink = `/review/${result.id}`;
    const bizPageLink = `/business/${result.id}`;
    const bizSearch = `?biz=${business.id}`;
    const reviewDisplay = (reviewsArray) => {
      const firstReview = reviewsArray[0];
      return (
      <Review
        key={ firstReview.id }
        review={ firstReview.review }
        bizLink={ bizLink }
        bizSearch= { bizSearch }
      />
      );
    };

    const ratingDisplay = (unisexRatingsArray, maleRatingsArray, femaleRatingsArray) => {
      let unisexRating = '';
      let maleRating = '';
      let femaleRating = '';
      if (unisexRatingsArray.length > 0) {
        unisexRating = ratingMath(unisexRatingsArray);
      } else {
        unisexRating = 'No Rating';
      }
      if (maleRatingsArray.length > 0) {
        maleRating = ratingMath(maleRatingsArray);
      } else {
        maleRating = 'No Rating';
      }
      if (femaleRatingsArray.length > 0) {
        femaleRating = ratingMath(femaleRatingsArray);
      } else {
        femaleRating = 'No Rating';
      }
      return (
        <div className='col-12 row'>
          <p className="col-3">Rating:</p>
          <p className='unisexRating col-3'>{createStars(unisexRating)}</p>
          <p className='maleRating col-3'>{createStars(maleRating)}</p>
          <p className='femaleRating col-3'>{createStars(femaleRating)}</p>
        </div>
      );
    };

    const changingTableDisplay = (uniTables, mTables, fTables) => (
        <div className='col-12 row'>
          <p className="col">Changing Table:</p>
          <p className="col">{uniTables.length > 0 ? uniTables[0].status === true ? <i className="fas fa-baby"></i> : <i className="fas red-baby fa-baby"></i> : '??'}</p>
          <p className="col">{mTables.length > 0 ? mTables[0].status === true ? <i className="fas fa-baby"></i> : <i className="fas red-baby fa-baby"></i> : '??'}</p>
          <p className="col">{fTables.length > 0 ? fTables[0].status === true ? <i className="fas fa-baby"></i> : <i className="fas red-baby fa-baby"></i> : '??'}</p>
        </div>
    );

    return (
      <div className="ResultRow col-12 mb-2 mt-2">
      <div className="card" onClick={this.showPopup}>
        <div className="row no-gutters">
          {/* <div className="result-image-div col-3">
            <img className="result-image img-fluid" src={result.photos[0]} alt={result.name}></img>
          </div> */}
          <div className="col-12">
            <div className="card-body row justify-content-between">
              <div className="col-8 result-name-div">
                <Link className="result-name card-title" to={{ pathname: bizPageLink, search: bizSearch }}>{result.name}</Link>
              </div>
              <div className="col-4">
                <p className="business-address">{result.location.address1}</p>
              </div>
            </div>
              { reviewDisplay(reviews) }
              <div className='container'>
                <div className='col-12 row'>
                  <p className='col underline'>Sex:</p>
                  <p className='col underline'>Unisex</p>
                  <p className='col underline'>Male</p>
                  <p className='col underline'>Female</p>
                </div>
              </div>
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
    );
  }
}

export default ResultRow;
