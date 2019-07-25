import React from 'react';
import { Link } from 'react-router-dom';

import createStars from '../../helpers/createStars';

import businessData from '../../helpers/data/businessData';
import yelpData from '../../helpers/data/yelpData';
import './SingleReview.scss';

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
    const { review } = this.props;
    const { yelpId, yelpResp } = this.state;
    const bizLink = `/business/${yelpId}`;
    const bizSearch = `?biz=${review.businessId}`;
    const forWhichBathroom = () => {
      const { restroomTypes } = this.props;
      const restroom = restroomTypes.filter(type => type.id === review.restroomType);
      return (
        <div className="col-4 single-review-sex">
          <p>{restroom[0].restroomType}</p>
        </div>
      );
    };

    return (
      <div className="SingleReview col-8 card">
        {/* <div className="card"> */}
          <div className="row no-gutters">
            <div className="col-3">
             <img className="single-review-photo img-fluid"src={yelpResp.photos} alt=''></img>
            </div>
            <div className="card-body col-9 row">
              <Link className="single-review-name col-6" to={{ pathname: bizLink, search: bizSearch }}>{yelpResp.name}</Link>
              <div className="col-2">
                <p className="single-review-date">Date</p>
              </div>
              { forWhichBathroom() }
              <div className="row col-12">
                <p className="col">Cleanliness: {createStars(review.cleanliness)}</p>
                <p className="col">Decor: {createStars(review.decor)}</p>
              </div>
              <div className="col-12">
                <p>"{review.review}"</p>
              </div>
            </div>
          </div>
        {/* </div> */}
      </div>
    );
  }
}

export default SingleReview;
