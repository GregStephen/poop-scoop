/* eslint-disable max-len */
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
    userLocation: {},
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

  amenitiesTable = (bizAmenities) => {
    const {
      amenityTypes,
    } = this.state;
    return (
    <table>
      <thead>
        <tr>
          <th>Amenitiy:</th>
          <th>Status:</th>
        </tr>
      </thead>
      <tbody>
      {bizAmenities.map(amenity => (
      <tr key={amenity.id}><td>{amenityTypes[amenity.type]}</td><td> {amenity.status ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}</td></tr>))}
      </tbody>
    </table>);
  }

  businessStuff = (bizRatings, bizAmenities, type) => {
    let displayRating = '';
    if (bizRatings.length > 0) {
      displayRating = ratingMath(bizRatings);
    } else {
      displayRating = '?';
    }
    return (
    <div>
      {displayRating === '?' ? ''
        : <div className="col mt-4">
            <h1>{type}</h1>
            <p>{createStars(displayRating)}</p>
            { this.amenitiesTable(bizAmenities) }
          </div>}
    </div>
    );
  };

  findDude = (latLng) => {
    const lati = latLng.lat;
    const long = latLng.lng;
    const tempUser = {
      lat: lati,
      lng: long,
    };
    this.setState({ userLocation: tempUser });
  }

  deleteReview = (id) => {
    ratingData.deleteReviewFromDatabase(id)
      .then(() => this.setRatingStuff())
      .catch(err => console.error('can not delete review', err));
  }

  printAddress = () => {
    const { yelpResults, userLocation } = this.state;
    if (yelpResults.location !== undefined) {
      const bizLocation = `${yelpResults.location.address1} ${yelpResults.location.city}, ${yelpResults.location.state}`;
      const userOrigin = `${userLocation.lat}, ${userLocation.lng}`;
      return (
          <form className="business-address-form" action="http://maps.google.com/maps" method="get" target="_blank">
            <p className="business-address">{yelpResults.location.address1}</p>
            <p>{yelpResults.location.city}, {yelpResults.location.state}</p>
            <input type="hidden" name="saddr" value={userOrigin}/>
            <input type="hidden" name="daddr" value={bizLocation}/>
            <button type="submit" className="btn btn-sm btn-info">Directions</button>
          </form>
      );
    }
    return '';
  }

  render() {
    const {
      yelpResults,
      reviews,
      restroomTypes,
      unisexRatings,
      maleRatings,
      femaleRatings,
      unisexAmenities,
      maleAmenities,
      femaleAmenities,
    } = this.state;
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
    <div className="Business container">
    <div className="business-info row">
      <h1 className="business-name col-12">{yelpResults.name}</h1>
      <div className="business-map col-12 col-md-6 col-lg-4">
        <BusinessMap yelpResults={yelpResults} findDude={this.findDude} />
      </div>
      <div className="business-stats col-12 col-md-6 col-lg-4">
        {this.printAddress()}
        <p>Number of reviews: {reviews.length}</p>
      </div>
    </div>
      <Link to={{ pathname: bizLink, search: bizSearch }}>Review their bathrooms!</Link>
      <div className="business-body container">
        <div className="row justify-content-around">
          { this.businessStuff(unisexRatings, unisexAmenities, 'Unisex') }
          { this.businessStuff(maleRatings, maleAmenities, 'Male') }
          { this.businessStuff(femaleRatings, femaleAmenities, 'Female') }
        </div>
      </div>
      <div className="reviews row justify-content-center">
        <h1 className="col-12">Reviews!</h1>
        { displayReviews }
      </div>
    </div>
    );
  }
}

export default Business;
