import React from 'react';

import yelpData from '../../helpers/data/yelpData';
import './Home.scss';

class Home extends React.Component {
  state = {
    search: '',
    yelpResults: [],
    latitude: 36.1627,
    longitude: -86.7816,
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  yelpSearch = (e) => {
    const { latitude, longitude, search } = this.state;
    e.preventDefault();
    console.error(this.state.search);
    yelpData.searchBusinessesByTerm(search, latitude, longitude)
      .then((res) => {
        console.error(res);
        const yelpRes = res;
        this.setState({ yelpResults: yelpRes });
      })
      .catch(err => console.error('cant get yelp data', err));
  }

  render() {
    return (
      <div className="Home">
        <h1>Wecome to PoopScoop!</h1>
        <form onSubmit={this.yelpSearch}>
          <input type="input" name="search" id="search" value={this.state.search} onChange={this.handleChange}></input>
          <button type="submit" className="btn btn-danger">Search</button>
        </form>
      </div>
    );
  }
}

export default Home;
