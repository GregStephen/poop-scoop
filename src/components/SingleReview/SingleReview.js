/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';

import forWhichBathroom from '../../helpers/forWhichBathroom';
import createStars from '../../helpers/createStars';

import businessData from '../../helpers/data/businessData';
import yelpData from '../../helpers/data/yelpData';
import './SingleReview.scss';

const moment = require('moment');

class SingleReview extends React.Component {
  state = {
    yelpResp: {},
  }

  componentDidMount() {
    const { review } = this.props;
    businessData.getSingleBusiness(review.businessId)
      .then((businessPromise) => {
        yelpData.getSingleBusiness(businessPromise.data.yelpId)
          .then((yelpResp) => {
            this.setState({ yelpResp });
            this.setState({ yelpId: businessPromise.data.yelpId });
          });
      })
      .catch(err => console.error('trouble with getting single business data', err));
  }

  render() {
    const { review, restroomTypes } = this.props;
    const { yelpId, yelpResp } = this.state;
    const bizLink = `/business/${yelpId}`;
    const bizSearch = `?biz=${review.businessId}`;
    const reviewDate = moment(review.timeStamp, 'YYYY-MM-DD').format('LL');

    return (
      <div className="SingleReview col-12 col-md-10 col-lg-8 col-xl-6">
      <div className="card">
        <Link className="single-review-name col-12" to={{ pathname: bizLink, search: bizSearch }}>{yelpResp.name}</Link>
        <div className="col-12 justify-content-around row">
          <p className="single-review-date col-5 col-md-3">{reviewDate}</p>
          { forWhichBathroom(restroomTypes, review) }
        </div>
        <div className="row col-12 justify-content-around">
            <p className="col-6">Cleanliness:</p>
            <p className="col-6">{createStars(review.cleanliness)}</p>
            <p className="col-6">Decor:</p>
            <p className="col-6">{createStars(review.decor)}</p>
        </div>
        <div className="col-12">
          <p>"{review.review}"</p>
        </div>
        </div>
      </div>
    );
  }
}

export default SingleReview;
