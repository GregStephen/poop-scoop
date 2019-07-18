import React from 'react';
// import queryString from 'query-string';
import {
  Form, FormGroup, Label, Input,
} from 'reactstrap';
import yelpData from '../../helpers/data/yelpData';
import restroomTypeData from '../../helpers/data/restroomTypeData';

import './ReviewPage.scss';
// import ratingData from '../../helpers/data/ratingData';

const defaultReview = {
  review: '',
  restroomType: '',
  cleanliness: 0,
  decor: 0,
  timeStamp: '',
};

class ReviewPage extends React.Component {
  state = {
    yelpResults: {},
    restroomTypes: [],
    newReview: defaultReview,
  }

  componentDidMount() {
    // const values = queryString.parse(this.props.location.search);
    // const bizId = values.biz;
    const { yelpId } = this.props.match.params;
    yelpData.getSingleBusiness(yelpId)
      .then((yelpResults) => {
        this.setState({ yelpResults });
      });
    restroomTypeData.getRestroomType().then((restroomTypes) => {
      this.setState({ restroomTypes });
    }).catch();
  }

  formFieldStringState = (e) => {
    const tempReview = { ...this.state.newReview };
    tempReview[e.target.id] = e.target.value;
    this.setState({ newReview: tempReview });
  }

  submitNewReview = (e) => {
    e.preventDefault();
    const { newReview } = this.state;
    const reviewToSave = { ...newReview };
    console.error(reviewToSave);
    // ratingData.postReview(reviewToSave).then().catch();
  }

  render() {
    const { yelpResults, restroomTypes, newReview } = this.state;
    return (
      <div className="ReviewPage">
        <h1>Review {yelpResults.name}!</h1>
        <Form onSubmit={this.submitNewReview}>
        <FormGroup>
          <Label for="restroomType">Which did you go into?</Label>
          <Input
            type="select"
            name="restroomType"
            id="restroomType"
            value={newReview.restroomType}
            onChange={this.formFieldStringState}
            required>
            <option value="">Select a bathroom</option>
          { restroomTypes.map(object => (
              <option key={object.id} value={object.id}>{object.restroomType}</option>
          )) }
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="timeStamp">When did you go?</Label>
          <Input
            type="date"
            name="timeStamp"
            id="timeStamp"
            onChange={this.formFieldStringState}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="review">Review</Label>
          <Input
            type="textarea"
            name="review"
            id="review"
            value={newReview.review}
            onChange={this.formFieldStringState}
            placeholder="This bathroom is awesome!"
            required
          />
        </FormGroup>
        </Form>
      </div>
    );
  }
}

export default ReviewPage;
