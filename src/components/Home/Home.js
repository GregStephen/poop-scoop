import React from 'react';

import './Home.scss';

class Home extends React.Component {
  state = {
    search: '',
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  yelpSearch = (e) => {
    e.preventDefault();
    console.error(this.state.search);
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
