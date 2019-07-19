/* eslint-disable max-len */
import React from 'react';
import queryString from 'query-string';
import {
  Form, FormGroup, Label, Input,
} from 'reactstrap';
import yelpData from '../../helpers/data/yelpData';
import restroomTypeData from '../../helpers/data/restroomTypeData';
import businessData from '../../helpers/data/businessData';
import amenityTypeData from '../../helpers/data/amenityTypeData';

import './ReviewPage.scss';
import amenityData from '../../helpers/data/amenityData';

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
    business: {},
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
        this.setState({ business });
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

  addToAmenityTheyHaveArray = () => {
    const tempArray = this.state.amenitiesTheyHave;
    console.error(tempArray);
  }

  submitNewReview = (e) => {
    e.preventDefault();
    const { newReview } = this.state;
    const reviewToSave = { ...newReview };
    console.error(reviewToSave);
    // ratingData.postReview(reviewToSave).then().catch();
  }

  amenityList = () => {
    const { amenityTypes, businessAmenities, newReview } = this.state;
    const amenTypesKeys = Object.keys(amenityTypes);
    const removeTheseFromList = [];
    // sorts thru restroom types and only have the amenities for the bathroom picked
    const specificAmenities = businessAmenities.filter(amenity => amenity.restroomType === newReview.restroomType);
    specificAmenities.forEach((amenity) => {
      const amenitiesToRemove = amenTypesKeys.filter(key => key === amenity.type);
      removeTheseFromList.push(amenitiesToRemove[0]);
    });
    const amenitiesToShowAsOptions = amenTypesKeys;
    removeTheseFromList.forEach((alreadyListed) => {
      const pos = amenTypesKeys.indexOf(alreadyListed);
      amenitiesToShowAsOptions.splice(pos, 1);
    });
    console.error('show these', amenitiesToShowAsOptions);
    console.error('remove from list array ', removeTheseFromList);
    // need to get the names of the types from the original amenityType Array
    // then find a way to map them all into options
    return (

      <option defaultValue>Pick options this bathroom has</option>
      // { amenitiesToShowAsOptions.map(object => (
      // <option key={object} value={object}>{object}</option>
      // ))
      // }
    );
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
          <Label for="amenitiesTheyHave">Which amenities did they have?</Label>
          <Input
            type="select"
            name="amenitiesTheyHave"
            id="amenitiesTheyHave"
            value={this.state.amenitiesTheyHave}
            onChange={this.addToAmenityArray}
            multiple
            required>
              { newReview.restroomType === '' ? <option value="">Select a bathroom first</option>
                : this.amenityList()
          }
          </Input>
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
