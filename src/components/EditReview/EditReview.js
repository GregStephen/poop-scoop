import React from 'react';
import queryString from 'query-string';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';

import yelpData from '../../helpers/data/yelpData';
import restroomTypeData from '../../helpers/data/restroomTypeData';
import ratingData from '../../helpers/data/ratingData';

import './EditReview.scss';

const moment = require('moment');

class EditReview extends React.Component {
  state = {
    editedReview: {
      review: '',
      restroomType: '',
      decor: '',
      cleanliness: '',
      uid: '',
      businessId: '',
      timeStamp: '',
    },
    bizId: '',
    yelpResults: {},
    restroomTypes: [],
    reviewId: '',
  }

  componentDidMount() {
    const { yelpId } = this.props.match.params;
    const values = queryString.parse(this.props.location.search);
    const bizId = values.biz;
    const reviewId = values.review;
    yelpData.getSingleBusiness(yelpId)
      .then((yelpResults) => {
        this.setState({ yelpResults });
        this.setState({ bizId });
        this.setState({ reviewId });
      });
    restroomTypeData.getRestroomType()
      .then((restroomTypes) => {
        this.setState({ restroomTypes });
      })
      .catch(err => console.error('trouble getting restroom data', err));
    ratingData.getRatingById(reviewId)
      .then(editedReviewPromise => this.setState({ editedReview: editedReviewPromise.data }))
      .catch(err => console.error('trouble fetching the review', err));
  }

  formFieldStringState = (e) => {
    const tempReview = { ...this.state.editedReview };
    tempReview[e.target.id] = e.target.value;
    this.setState({ editedReview: tempReview });
  }

  setCleanlinessDecorValue = (e) => {
    e.preventDefault();
    const { editedReview } = this.state;
    const tempReview = { ...editedReview };
    if (
      tempReview[e.target.id] === parseInt(e.target.value, 10)
    ) {
      tempReview[e.target.id] = 1;
    } else {
      tempReview[e.target.id] = parseInt(e.target.value, 10);
    }
    this.setState({ editedReview: tempReview });
  }

  createDecorButtons = () => {
    const { editedReview } = this.state;
    const decorButtons = [];
    for (let i = 1; i < editedReview.decor + 1; i += 1) {
      decorButtons.push(<button className="btn btn-success" id="decor" key={i} value={i} onClick={this.setCleanlinessDecorValue}>{i}</button>);
    }
    for (let m = editedReview.decor + 1; m < 6; m += 1) {
      decorButtons.push(<button className="btn btn-danger" id="decor" key={m} value={m} onClick={this.setCleanlinessDecorValue}>{m}</button>);
    }
    return decorButtons;
  }

  createCleanlinessButtons = () => {
    const { editedReview } = this.state;
    const cleanlinessButtons = [];
    for (let i = 1; i < editedReview.cleanliness + 1; i += 1) {
      cleanlinessButtons.push(<button className="btn btn-success" id="cleanliness" key={i} value={i} onClick={this.setCleanlinessDecorValue}>{i}</button>);
    }
    for (let m = editedReview.cleanliness + 1; m < 6; m += 1) {
      cleanlinessButtons.push(<button className="btn btn-danger" id="cleanliness" key={m} value={m} onClick={this.setCleanlinessDecorValue}>{m}</button>);
    }
    return cleanlinessButtons;
  }

  submitEditedReview = (e) => {
    e.preventDefault();
    const {
      editedReview, reviewId, bizId,
    } = this.state;
    const { yelpId } = this.props.match.params;
    const reviewToSave = { ...editedReview };
    ratingData.editReview(reviewToSave, reviewId)
      .then(() => this.props.history.push(`/business/${yelpId}?biz=${bizId}`))
      .catch(err => console.error('trouble editing review', err));
  }

  render() {
    const { yelpResults, editedReview, restroomTypes } = this.state;
    return (
      <div className='EditReview'>
         <h1>Edit Your Review Of {yelpResults.name}!</h1>
        <div className="decorRating">
          <p>Decor:</p>
            { this.createDecorButtons() }
        </div>
        <div className="cleanlinessRating">
          <p>Cleanliness:</p>
            { this.createCleanlinessButtons() }
        </div>
        <Form onSubmit={this.submitEditedReview}>
        <FormGroup>
          <Label for="restroomType">Which did you go into?</Label>
          <Input
            type="select"
            name="restroomType"
            id="restroomType"
            value={editedReview.restroomType}
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
            value={editedReview.timeStamp}
            onChange={this.formFieldStringState}
            max={moment().format('YYYY[-]MM[-]DD')}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="review">Review</Label>
          <Input
            type="textarea"
            name="review"
            id="review"
            value={editedReview.review}
            onChange={this.formFieldStringState}
            placeholder="This bathroom is awesome!"
            required
          />
        </FormGroup>
        <Button type="submit" className="btn btn-success">Edit Your Review!</Button>
        </Form>
      </div>
    );
  }
}

export default EditReview;
