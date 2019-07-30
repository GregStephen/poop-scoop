import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import ScoopMap from '../ScoopMap/ScoopMap';
import ResultRow from '../ResultRow/ResultRow';

import businessData from '../../helpers/data/businessData';
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
    selectedMarker: '',
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
        res.forEach((yelpie, index) => {
          if (yelpie.coordinates === undefined || yelpie.coordinates === 'undefined' || yelpie.coordinates === null) {
            yelpRes.splice(index, 1);
          }
        });
        this.setState({ yelpResults: yelpRes });
        const tempMarkers = [];
        this.state.yelpResults.map(result => (
          businessData.getBusinessesById(result.id)
            .then((bizData) => {
              const tempMarker = {
                title: result.name,
                latlng: { lat: result.coordinates.latitude, lng: result.coordinates.longitude },
                bizLink: `/business/${result.id}`,
                bizSearch: `?biz=${bizData !== undefined ? bizData.id : 'undefined'}`,
                image: result.photos[0],
                key: result.id,
                isRated: bizData !== undefined,
              };
              tempMarkers.push(tempMarker);
              this.setState({ markersData: tempMarkers });
            })
            .catch()
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

  findDude = (latLing) => {
    this.setState({ latitude: latLing.lat, longitude: latLing.lng });
  }

  selectBusiness = (bizId) => {
    this.setState({ selectedMarker: bizId });
  }

  render() {
    const {
      yelpResults, restroomTypes, amenityTypes, markersData, selectedMarker,
    } = this.state;
    const resultComponents = yelpResults.map(result => (
      <ResultRow
      key={ result.id }
      result={ result }
      restroomTypes={ restroomTypes }
      amenityTypes={ amenityTypes }
      selectBusiness={ this.selectBusiness }
      />
    ));
    return (
      <div className="Home">
        <form onSubmit={this.yelpSearch}>
          <button type="submit" className="search-btn btn btn-danger">Search Restrooms Near Me</button>
        </form>
        <div className="mapDiv">
          <ScoopMap
          markersData={ markersData }
          findDude={ this.findDude }
          selectedMarker={ selectedMarker }/>
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
