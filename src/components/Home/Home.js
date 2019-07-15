import React from 'react';

import ResultRow from '../ResultRow/ResultRow';

import yelpData from '../../helpers/data/yelpData';
// import pScoopBizData from '../../helpers/data/businessData';

import './Home.scss';

class Home extends React.Component {
  state = {
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

  render() {
    const { yelpResults } = this.state;
    const resultComponents = yelpResults.map(result => (
      <ResultRow key={ result.id } result={ result } />
    ));
    return (
      <div className="Home">
        <h1>Wecome to PoopScoop!</h1>
        <form onSubmit={this.yelpSearch}>
          <input type="input" name="search" id="search" value={this.state.search} onChange={this.handleChange}></input>
          <button type="submit" className="btn btn-danger">Search</button>
          <ul>
            { resultComponents }
          </ul>
        </form>
      </div>
    );
  }
}

export default Home;
