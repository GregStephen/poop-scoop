import React from 'react';

import ResultRow from '../ResultRow/ResultRow';

import restroomType from '../../helpers/data/restroomTypeData';
import amenityTypeData from '../../helpers/data/amenityTypeData';
import yelpData from '../../helpers/data/yelpData';

import './Home.scss';

class Home extends React.Component {
  state = {
    restroomTypes: [],
    amenityTypes: {},
    search: '',
    yelpResults: [],
    latitude: 36.1627,
    longitude: -86.7816,
    businessResults: [],
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  yelpSearch = (e) => {
    const {
      latitude,
      longitude,
      search,
    } = this.state;
    e.preventDefault();
    yelpData.searchBusinessesByTerm(search, latitude, longitude)
      .then((res) => {
        const yelpRes = res;
        console.error(yelpRes);
        this.setState({ yelpResults: yelpRes });
      })
      .catch(err => console.error('cant get yelp data', err));
  }

  componentDidMount() {
    restroomType.getRestroomType()
      .then((restroomTypes) => {
        this.setState({ restroomTypes });
      })
      .catch();
    amenityTypeData.getAmenityTypes()
      .then((amenityTypes) => {
        this.setState({ amenityTypes });
      })
      .catch();
  }

  render() {
    const { yelpResults, restroomTypes, amenityTypes } = this.state;
    const resultComponents = yelpResults.map(result => (
      <ResultRow
      key={ result.id }
      result={ result }
      restroomTypes={ restroomTypes }
      amenityTypes={ amenityTypes }
      />
    ));
    return (
      <div className="Home">
        <h1>Wecome to PoopScoop!</h1>
        <form onSubmit={this.yelpSearch}>
          <input type="input" name="search" id="search" value={this.state.search} onChange={this.handleChange}></input>
          <button type="submit" className="btn btn-danger">Search</button>
        </form>
        <div className="container">
          <div className="row">
          { resultComponents }
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
