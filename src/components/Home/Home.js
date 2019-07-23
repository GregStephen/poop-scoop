import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import Map from '../Map/Map';
import ResultRow from '../ResultRow/ResultRow';

import restroomType from '../../helpers/data/restroomTypeData';
import amenityTypeData from '../../helpers/data/amenityTypeData';
import yelpData from '../../helpers/data/yelpData';
import userData from '../../helpers/data/userData';

import './Home.scss';
import 'leaflet/dist/leaflet.css';

class Home extends React.Component {
  state = {
    restroomTypes: [],
    amenityTypes: {},
    yelpResults: [],
    latitude: 36.1627,
    longitude: -86.7816,
    businessResults: [],
    markersData: [],
  }

  yelpSearch = (e) => {
    const {
      latitude,
      longitude,
    } = this.state;
    e.preventDefault();
    yelpData.searchBusinessesByTerm(latitude, longitude)
      .then((res) => {
        const yelpRes = res;
        this.setState({ markersData: [] });
        this.setState({ yelpResults: yelpRes });
        this.state.yelpResults.map(result => (
          this.setState({
            markersData: [
              ...this.state.markersData,
              {
                title: result.name,
                latLng: { lat: result.coordinates.latitude, lng: result.coordinates.longitude },
                image: result.photos,
              }],
          })
        ));
      })
      .catch(err => console.error('cant get yelp data', err));
  }

  componentDidMount() {
    const firebaseId = firebase.auth().currentUser.uid;
    userData.getUserByUID(firebaseId)
      .then((resp) => {
        if (resp === undefined) {
          this.props.history.push('/new-user');
        } else {
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
      }).catch(err => console.error('can not get user', err));
  }

  addMarker = (markerInfo) => {
    this.setState({
      markersData: [
        ...this.state.markersData,
        {
          title: markerInfo.name,
          latLng: markerInfo.latLng,
          image: markerInfo.image,
        }],
    });
  }

  findDude = (latLing) => {
    this.setState({ latitude: latLing.lat, longitude: latLing.lng });
  }

  render() {
    const {
      yelpResults, restroomTypes, amenityTypes, markersData,
    } = this.state;
    const resultComponents = yelpResults.map(result => (
      <ResultRow
      key={ result.id }
      result={ result }
      restroomTypes={ restroomTypes }
      amenityTypes={ amenityTypes }
      addMarker={ this.addMarker }
      />
    ));
    return (
      <div className="Home">
        <form onSubmit={this.yelpSearch}>
          <button type="submit" className="search-btn btn btn-danger">Search Restrooms Near Me</button>
        </form>
        <div className="mapDiv">
          <Map
            markersData={ markersData }
            findDude={ this.findDude }
          />
        </div>
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
