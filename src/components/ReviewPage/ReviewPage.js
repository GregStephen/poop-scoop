/* eslint-disable max-len */
import React from 'react';
import queryString from 'query-string';
import {
  Form, FormGroup, Label, Input, FormText, Button, Row, Col,
} from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';

import yelpData from '../../helpers/data/yelpData';
import restroomTypeData from '../../helpers/data/restroomTypeData';
import businessData from '../../helpers/data/businessData';
import amenityTypeData from '../../helpers/data/amenityTypeData';
import amenityData from '../../helpers/data/amenityData';
import ratingData from '../../helpers/data/ratingData';

import './ReviewPage.scss';

const moment = require('moment');

const defaultReview = {
  review: '',
  restroomType: '',
  cleanliness: 1,
  decor: 1,
  timeStamp: '',
};

class ReviewPage extends React.Component {
  state = {
    yelpResults: {},
    bizId: '',
    businessAmenities: [],
    amenitiesTheyHave: [],
    amenitiesTheyDoNotHave: [],
    amenityTypes: {},
    restroomTypes: [],
    newReview: defaultReview,
  }

  createNewBusiness = (yelpId) => {
    const newBusiness = {
      yelpId,
      zip: this.state.yelpResults.location.postal_code,
    };
    businessData.postNewBiz(newBusiness).then(() => {
      businessData.getBusinessesById(yelpId).then((business) => {
        this.setState({ bizId: business.id });
      });
    }).catch();
  }

  componentDidMount() {
    const { yelpId } = this.props.match.params;
    const values = queryString.parse(this.props.location.search);
    const bizId = values.biz;
    yelpData.getSingleBusiness(yelpId)
      .then((yelpResults) => {
        this.setState({ yelpResults });
        bizId === 'undefined' ? this.createNewBusiness(yelpId) : this.setState({ bizId });
      });
    restroomTypeData.getRestroomType()
      .then((restroomTypes) => {
        this.setState({ restroomTypes });
      })
      .catch(err => console.error('trouble getting restroom data', err));
    amenityTypeData.getAmenityTypes()
      .then((amenityTypes) => {
        this.setState({ amenityTypes });
      })
      .catch(err => console.error('trouble getting amenity type data', err));
    amenityData.getAmenitiesByBusinessId(bizId)
      .then((businessAmenities) => {
        this.setState({ businessAmenities });
      })
      .catch(err => console.error('trouble getting businesses amenities', err));
  }

  formFieldStringState = (e) => {
    const tempReview = { ...this.state.newReview };
    tempReview[e.target.id] = e.target.value;
    this.setState({ newReview: tempReview });
  }

  setCleanlinessDecorValue = (e) => {
    e.preventDefault();
    const { newReview } = this.state;
    const tempReview = { ...newReview };
    if (
      tempReview[e.target.id] === parseInt(e.target.value, 10)
    ) {
      tempReview[e.target.id] = 1;
    } else {
      tempReview[e.target.id] = parseInt(e.target.value, 10);
    }
    this.setState({ newReview: tempReview });
  };

  createDecorButtons = () => {
    const { newReview } = this.state;
    const decorButtons = [];
    for (let i = 1; i < newReview.decor + 1; i += 1) {
      decorButtons.push(<button type="button" className="fas fa-star fa-2x" id="decor" key={i} value={i} onClick={this.setCleanlinessDecorValue}></button>);
    }
    for (let m = newReview.decor + 1; m < 6; m += 1) {
      decorButtons.push(<button type="button" className="far fa-star fa-2x" id="decor" key={m} value={m} onClick={this.setCleanlinessDecorValue}></button>);
    }
    return decorButtons;
  }

  createCleanlinessButtons = () => {
    const { newReview } = this.state;
    const cleanlinessButtons = [];
    for (let i = 1; i < newReview.cleanliness + 1; i += 1) {
      cleanlinessButtons.push(<button type="button" className="fas fa-star fa-2x" id="cleanliness" key={i} value={i} onClick={this.setCleanlinessDecorValue}></button>);
    }
    for (let m = newReview.cleanliness + 1; m < 6; m += 1) {
      cleanlinessButtons.push(<button type="button" className="far fa-star fa-2x" id="cleanliness" key={m} value={m} onClick={this.setCleanlinessDecorValue}></button>);
    }
    return cleanlinessButtons;
  }

  addToAmenityTheyHaveArray = (e) => {
    const { amenitiesTheyHave } = this.state;
    let value = [...amenitiesTheyHave];
    if (value.includes(e.target.value)) {
      const pos = value.indexOf(e.target.value);
      value.splice(pos, 1);
    } else if (e.target.value === '') {
      value = [];
    } else {
      value.push(e.target.value);
    }
    this.setState({ amenitiesTheyHave: value });
  }

  addToAmenitiesTheyDoNotHaveArray = (e) => {
    const { amenitiesTheyDoNotHave } = this.state;
    let value = [...amenitiesTheyDoNotHave];
    if (value.includes(e.target.value)) {
      const pos = value.indexOf(e.target.value);
      value.splice(pos, 1);
    } else if (e.target.value === '') {
      value = [];
    } else {
      value.push(e.target.value);
    }
    this.setState({ amenitiesTheyDoNotHave: value });
  }

  amenityTheyHaveList = () => {
    const {
      amenityTypes, businessAmenities, newReview, amenitiesTheyDoNotHave,
    } = this.state;
    const amenTypesKeys = Object.keys(amenityTypes);
    // sorts thru restroom types and only have the amenities for the bathroom picked
    const specificAmenities = businessAmenities.filter(amenity => amenity.restroomType === newReview.restroomType);
    const amenitiesToShowAsOptions = amenTypesKeys;
    specificAmenities.forEach((alreadyListed) => {
      const pos = amenTypesKeys.indexOf(alreadyListed.type);
      amenitiesToShowAsOptions.splice(pos, 1);
    });
    const options = amenitiesToShowAsOptions.map((object) => {
      if (amenitiesTheyDoNotHave.includes(object)) {
        return <option key={object} value={object} disabled>{amenityTypes[object]}</option>;
      }
      return <option key={object} value={object}>{amenityTypes[object]}</option>;
    });
    options.unshift(<option key='pick' disabled>Pick options this bathroom has</option>);
    return options;
  }

  amenityTheyDoNotHaveList = () => {
    const {
      amenityTypes, businessAmenities, newReview, amenitiesTheyHave,
    } = this.state;
    const amenTypesKeys = Object.keys(amenityTypes);
    // sorts thru restroom types and only have the amenities for the bathroom picked
    const specificAmenities = businessAmenities.filter(amenity => amenity.restroomType === newReview.restroomType);
    const amenitiesToShowAsOptions = amenTypesKeys;
    specificAmenities.forEach((alreadyListed) => {
      const pos = amenTypesKeys.indexOf(alreadyListed.type);
      amenitiesToShowAsOptions.splice(pos, 1);
    });
    const options = amenitiesToShowAsOptions.map((object) => {
      if (amenitiesTheyHave.includes(object)) {
        return <option key={object} value={object} disabled>{amenityTypes[object]}</option>;
      }
      return <option key={object} value={object}>{amenityTypes[object]}</option>;
    });
    options.unshift(<option key='pick not' disabled>Pick options this bathroom does not have</option>);
    return options;
  }

  submitNewReview = (e) => {
    e.preventDefault();
    const {
      newReview, bizId, amenitiesTheyDoNotHave, amenitiesTheyHave,
    } = this.state;
    const { yelpId } = this.props.match.params;
    const reviewToSave = { ...newReview };
    reviewToSave.uid = firebase.auth().currentUser.uid;
    reviewToSave.businessId = bizId;
    amenitiesTheyDoNotHave.forEach((amenity) => {
      const amenityToAdd = {};
      amenityToAdd.businessId = bizId;
      amenityToAdd.restroomType = newReview.restroomType;
      amenityToAdd.status = false;
      amenityToAdd.type = amenity;
      amenityData.addAnAmenity(amenityToAdd);
    });
    amenitiesTheyHave.forEach((amenity) => {
      const amenityToAdd = {};
      amenityToAdd.businessId = bizId;
      amenityToAdd.restroomType = newReview.restroomType;
      amenityToAdd.status = true;
      amenityToAdd.type = amenity;
      amenityData.addAnAmenity(amenityToAdd);
    });
    ratingData.addNewReview(reviewToSave)
      .then(() => this.props.history.push(`/business/${yelpId}?biz=${bizId}`))
      .catch(err => console.error('trouble adding review', err));
  }

  showAmenitiesChosen = (theyHave) => {
    const { amenitiesTheyHave, amenitiesTheyDoNotHave, amenityTypes } = this.state;
    const list = theyHave ? amenitiesTheyHave.map((thing, index) => {
      if (index !== 0) {
        return `, ${amenityTypes[thing]}`;
      }
      return amenityTypes[thing];
    })
      : amenitiesTheyDoNotHave.map((thing, index) => {
        if (index !== 0) {
          return `, ${amenityTypes[thing]}`;
        }
        return amenityTypes[thing];
      });
    return list;
  }

  render() {
    const { yelpResults, restroomTypes, newReview } = this.state;
    return (
      <div className="ReviewPage">
        <h1>Review {yelpResults.name}!</h1>
        <div className="row mb-4 mt-4">
        <div className="decorRating col-8 col-md-4 offset-2">
          <p>Decor:</p>
            { this.createDecorButtons() }
        </div>
        <div className="cleanlinessRating col-8 col-md-4 offset-2 offset-md-0">
          <p>Cleanliness:</p>
            { this.createCleanlinessButtons() }
        </div>
        </div>

        <Form onSubmit={this.submitNewReview}>
          <Row form>
            <Col md={{ size: 4, offset: 4 }} xs={{ size: 10, offset: 1 }}>
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
            </Col>
          </Row>
          <Row form>
            <Col md={{ size: 4, offset: 4 }} xs={{ size: 10, offset: 1 }}>
              <FormGroup>
                <Label for="timeStamp">When did you go?</Label>
                <Input
                  type="date"
                  name="timeStamp"
                  id="timeStamp"
                  onChange={this.formFieldStringState}
                  max={moment().format('YYYY[-]MM[-]DD')}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={{ size: 4, offset: 2 }} sm={{ size: 5, offset: 1 }} xs={{ size: 10, offset: 1 }}>
              <FormGroup>
                <Label for="amenitiesTheyHave">Which did they have?</Label>
                <Input
                  type="select"
                  name="amenitiesTheyHave"
                  id="amenitiesTheyHave"
                  value={this.state.amenitiesTheyHave}
                  onChange={this.addToAmenityTheyHaveArray}
                  multiple
                  >
                    { newReview.restroomType === '' ? <option value="">Select a bathroom first</option>
                      : this.amenityTheyHaveList()
                }
                </Input>
                <FormText color="muted">
                  cmd + click to remove the last selection
                </FormText>
                {this.showAmenitiesChosen(true)}
              </FormGroup>
            </Col>
            <Col md={{ size: 4, offset: 0 }} sm={{ size: 5, offset: 0 }} xs={{ size: 10, offset: 1 }}>
              <FormGroup>
                <Label for="amenitiesTheyDoNotHave">Which did they NOT have?</Label>
                <Input
                  type="select"
                  name="amenitiesTheyDoNotHave"
                  id="amenitiesTheyDoNotHave"
                  value={this.state.amenitiesTheyDoNotHave}
                  onChange={this.addToAmenitiesTheyDoNotHaveArray}
                  multiple
                  >
                    { newReview.restroomType === '' ? <option value="">Select a bathroom first</option>
                      : this.amenityTheyDoNotHaveList()
                }
                </Input>
                <FormText color="muted">
                  cmd + click to remove the last selection
                </FormText>
                {this.showAmenitiesChosen(false)}
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs={{ size: 10, offset: 1 }} md={{ size: 8, offset: 2 }}>
              <FormGroup>
                <Label for="review">Review</Label>
                <Input
                  type="textarea"
                  name="review"
                  id="review"
                  rows="4"
                  value={newReview.review}
                  onChange={this.formFieldStringState}
                  placeholder="This bathroom is awesome!"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit" className="btn btn-success">Submit Review!</Button>
        </Form>
      </div>
    );
  }
}

export default ReviewPage;
