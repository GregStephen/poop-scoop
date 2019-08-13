/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';

import Review from '../Review/Review';

import businessData from '../../helpers/data/businessData';
import ratingData from '../../helpers/data/ratingData';
import amenityData from '../../helpers/data/amenityData';
import userData from '../../helpers/data/userData';

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
    reviewer: {},
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
                userData.getUserByUID(reviews[0].uid)
                  .then(reviewer => this.setState({ reviewer }))
                  .catch(err => console.error('could not get reviewer', err));
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
    const {
      result, latitude, longitude, restroomTypes,
    } = this.props;
    const userLocation = `${latitude}, ${longitude}`;
    const bizLocation = `${result.location.address1} ${result.location.city}, ${result.location.state}`;
    const {
      business,
      reviews,
      unisexRatings,
      maleRatings,
      femaleRatings,
      maleTables,
      femaleTables,
      unisexTables,
      reviewer,
    } = this.state;
    const milesAway = Math.round((result.distance / 1609.344) * 10) / 10;
    const bizLink = `/review/${result.id}`;
    const bizPageLink = `/business/${result.id}`;
    const bizSearch = `?biz=${business.id}`;
    const reviewDisplay = (reviewsArray) => {
      const firstReview = reviewsArray[0];
      return (
      <Review
        key={ firstReview.id }
        review={ firstReview.review }
        restroomType={ firstReview.restroomType }
        restroomTypes={ restroomTypes }
        reviewer={ reviewer }
        bizLink={ bizLink }
        bizSearch= { bizSearch }
      />
      );
    };

    const ratingDisplay = (ratingsArray) => {
      let displayRating = '';
      if (ratingsArray.length > 0) {
        displayRating = ratingMath(ratingsArray);
      } else {
        displayRating = '?';
      }
      return (
          <td>{createStars(displayRating)}</td>
      );
    };

    const changingTableDisplay = tables => (
          <td>{tables.length > 0 ? tables[0].status === true ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i> : <i className="fas fa-question"></i>}</td>
    );

    return (
      <div className="ResultRow col-12 mb-2 mt-2">
      <div className="card mb-2" onClick={this.showPopup}>
        <div className="row">
          <div className="col-12">
            <div className="card-body row justify-content-between">
              <div className="col-8 result-name-div">
                <Link className="result-name card-title" to={{ pathname: bizPageLink, search: bizSearch }}>{result.name}</Link>
              </div>
              <div className="col-4 result-address-div">
                <form action="http://maps.google.com/maps" method="get" target="_blank">
                <p className="business-address">{result.location.address1}</p>
                <input type="hidden" name="saddr" value={userLocation}/>
                <input type="hidden" name="daddr" value={bizLocation}/>
                <p>{milesAway} miles away</p>
                <button type="submit" className="btn btn-sm btn-info">Directions</button>
                </form>
              </div>
            </div>
              { reviewDisplay(reviews) }
              <Table>
                <thead>
                  <tr>
                    <th>Sex:</th>
                    <th>Review:</th>
                    <th><i className="fas fa-baby"></i></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="sex-symbol" scope="row">&#x26A5;</th>
                    { ratingDisplay(unisexRatings) }
                    { changingTableDisplay(unisexTables) }
                  </tr>
                  <tr>
                    <th className="sex-symbol" scope="row">&#x2642;</th>
                    { ratingDisplay(maleRatings) }
                    { changingTableDisplay(maleTables) }
                  </tr>
                  <tr>
                    <th className="sex-symbol" scope="row">&#x2640;</th>
                    { ratingDisplay(femaleRatings) }
                    { changingTableDisplay(femaleTables) }
                  </tr>
                </tbody>
              </Table>
            </div>
        </div>
      </div>
    </div>
    );
  }
}

export default ResultRow;
