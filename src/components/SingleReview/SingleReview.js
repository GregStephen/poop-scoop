import React from 'react';
import { Link } from 'react-router-dom';

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
          });
      })
      .catch(err => console.error('trouble with getting single business data', err));
  }

  render() {
    const { review } = this.props;
    const { yelpResp } = this.state;
    const bizLink = `/business${yelpResp.id}`;
    const bizSearch = `?biz=${review.businessId}`;
    const forWhichBathroom = () => {
      const { restroomTypes } = this.props;
      const restroom = restroomTypes.filter(type => type.id === review.restroomType);
      return (
        <div>
          <p>{restroom[0].restroomType}</p>
        </div>
      );
    };
    return (
      <div className="SingleReview">
        <div>
        <Link to={{ pathname: bizLink, search: bizSearch }}><p>{yelpResp.name}</p></Link>
          <img className="single-review-photo"src={yelpResp.photos} alt=''></img>
          <p>Cleanliness: {review.cleanliness}</p>
          <p>Decor: {review.decor}</p>
          <p>{review.review}</p>
          { forWhichBathroom() }
        </div>
      </div>
    );
  }
}

export default SingleReview;
