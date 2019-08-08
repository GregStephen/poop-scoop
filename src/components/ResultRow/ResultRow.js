/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
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

    const ratingDisplay = (ratingsArray) => {
      let displayRating = '';
      if (ratingsArray.length > 0) {
        displayRating = ratingMath(ratingsArray);
      } else {
        displayRating = 'X';
      }
      return (
          <td>{createStars(displayRating)}</td>
      );
    };

    const changingTableDisplay = tables => (
          <td>{tables.length > 0 ? tables[0].status === true ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i> : '?'}</td>
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
              <div className="col-4">
                <p className="business-address">{result.location.address1}</p>
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
                    <th scope="row">&#x26A5;</th>
                    { ratingDisplay(unisexRatings) }
                    { changingTableDisplay(unisexTables) }
                  </tr>
                  <tr>
                    <th scope="row">&#x2642;</th>
                    { ratingDisplay(maleRatings) }
                    { changingTableDisplay(maleTables) }
                  </tr>
                  <tr>
                    <th scope="row">&#x2640;</th>
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
