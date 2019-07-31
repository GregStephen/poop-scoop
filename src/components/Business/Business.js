import React from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

import BusinessMap from '../BusinessMap/BusinessMap';
import ReviewOnBusinessPage from '../ReviewOnBusinessPage/ReviewOnBusinessPage';

import createStars from '../../helpers/createStars';
import ratingMath from '../../helpers/ratingMath';

import yelpData from '../../helpers/data/yelpData';
import ratingData from '../../helpers/data/ratingData';
import amenityData from '../../helpers/data/amenityData';
import restroomType from '../../helpers/data/restroomTypeData';
import amenityTypeData from '../../helpers/data/amenityTypeData';

import './Business.scss';

class Business extends React.Component {
  state = {
    yelpResults: {},
    restroomTypes: [],
    amenityTypes: {},
    reviews: [],
    amenities: [],
    maleRatings: [],
    femaleRatings: [],
    unisexRatings: [],
    unisexAmenities: [],
    maleAmenities: [],
    femaleAmenities: [],
  }


  seperateRatings = () => {
    const { reviews, restroomTypes } = this.state;
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

  seperateAmenities = () => {
    const { amenities, restroomTypes } = this.state;
    restroomTypes.forEach((type) => {
      if (type.id === 'restroom0') {
        const unisexAmenities = amenities.filter(amenity => amenity.restroomType === type.id);
        this.setState({ unisexAmenities });
      } else if (type.id === 'restroom1') {
        const maleAmenities = amenities.filter(amenity => amenity.restroomType === type.id);
        this.setState({ maleAmenities });
      } else if (type.id === 'restroom2') {
        const femaleAmenities = amenities.filter(amenity => amenity.restroomType === type.id);
        this.setState({ femaleAmenities });
      }
    });
  };

  setRatingStuff = (e) => {
    const values = queryString.parse(this.props.location.search);
    const bizId = values.biz;
    ratingData.getRatingByBusinessId(bizId)
      .then((reviews) => {
        if (reviews.length > 0) {
          this.setState({ reviews });
          this.seperateRatings();
        }
      });
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    const bizId = values.biz;
    const { yelpId } = this.props.match.params;
    restroomType.getRestroomType()
      .then((restroomTypes) => {
        this.setState({ restroomTypes });
        amenityTypeData.getAmenityTypes()
          .then((amenityTypes) => {
            this.setState({ amenityTypes });
            yelpData.getSingleBusiness(yelpId)
              .then((yelpResults) => {
                this.setState({ yelpResults });
                this.setRatingStuff();
                amenityData.getAmenitiesByBusinessId(bizId)
                  .then((amenities) => {
                    if (amenities.length > 0) {
                      this.setState({ amenities });
                      this.seperateAmenities();
                    }
                  });
              });
          });
      });
  }

    businessStuff = () => {
      const {
        unisexRatings,
        maleRatings,
        femaleRatings,
        unisexAmenities,
        maleAmenities,
        femaleAmenities,
        amenityTypes,
      } = this.state;
      let unisexRating = '';
      let maleRating = '';
      let femaleRating = '';
      if (unisexRatings.length > 0) {
        unisexRating = ratingMath(unisexRatings);
      } else {
        unisexRating = 'No Rating';
      }
      if (maleRatings.length > 0) {
        maleRating = ratingMath(maleRatings);
      } else {
        maleRating = 'No Rating';
      }
      if (femaleRatings.length > 0) {
        femaleRating = ratingMath(femaleRatings);
      } else {
        femaleRating = 'No Rating';
      }
      return (
      <div className='col-12 row'>
        {unisexRating === 'No Rating' ? ''
          : <div className="col">
              <h1>Unisex</h1>
              <p className='unisexRating'>{createStars(unisexRating)}</p>
              <ul>
                {unisexAmenities.map(amenity => (
                <li key={amenity.id}>{amenityTypes[amenity.type]} : {amenity.status ? 'Yes' : 'No'}</li>))}
              </ul>
            </div>}
        {maleRating === 'No Rating' ? ''
          : <div className="col">
              <h1>Male</h1>
              <p className='maleRating'>{createStars(maleRating)}</p>
              <ul>
                {maleAmenities.map(amenity => (
                <li key={amenity.id}>{amenityTypes[amenity.type]} : {amenity.status ? 'Yes' : 'No'}</li>))}
              </ul>
            </div>}
        {femaleRating === 'No Rating' ? ''
          : <div className="col">
              <h1>Female</h1>
              <p className='femaleRating'>{createStars(femaleRating)}</p>
              <ul>
              {femaleAmenities.map(amenity => (
                  <li key={amenity.id}>{amenityTypes[amenity.type]} : {amenity.status ? 'Yes' : 'No'}</li>))}
              </ul>
            </div>}
      </div>
      );
    };

    deleteReview = (id) => {
      ratingData.deleteReviewFromDatabase(id)
        .then(() => this.setRatingStuff())
        .catch(err => console.error('can not delete review', err));
    }

    render() {
      const { yelpResults, reviews, restroomTypes } = this.state;
      const { yelpId } = this.props.match.params;
      const values = queryString.parse(this.props.location.search);
      const bizLink = `/review/${yelpId}`;
      const bizSearch = `?biz=${values.biz}`;

      const displayReviews = reviews.map(review => (
      <ReviewOnBusinessPage
      key={ review.id }
      restroomTypes={ restroomTypes }
      review={ review }
      deleteReview={ this.deleteReview }
      yelpId={ yelpId }
      />
      ));

      return (
      <div className="Business">
        <img className="businessPhoto" src={yelpResults.photos} alt=''></img>
        <h1>{yelpResults.name}</h1>
        <BusinessMap yelpResults={yelpResults} />
        <Link to={{ pathname: bizLink, search: bizSearch }}>Review their bathrooms!</Link>
        <div className="business-body container">
          { this.businessStuff() }
        </div>
        <div className="reviews">
          <h1>Reviews!</h1>
          { displayReviews }
        </div>
      </div>
      );
    }
}

export default Business;
