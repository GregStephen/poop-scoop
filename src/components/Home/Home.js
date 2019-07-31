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
    offset: 0,
    businessResults: [],
    markersData: [],
    selectedMarker: '',
  }

  yelpSearch = (offset) => {
    const {
      latitude,
      longitude,
    } = this.state;
    yelpData.searchBusinessesByTerm(latitude, longitude, offset)
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

  showNextResults = (e) => {
    e.preventDefault();
    const increase = 15;
    const tempOffset = this.state.offset;
    const newOffset = tempOffset + increase;
    this.setState({ offset: newOffset });
    this.yelpSearch(newOffset);
  }

  showPrevResults = (e) => {
    e.preventDefault();
    const decrease = 15;
    const tempOffset = this.state.offset;
    const newOffset = tempOffset - decrease;
    this.setState({ offset: newOffset });
    this.yelpSearch(newOffset);
  }

  firstSearch = (e) => {
    e.preventDefault();
    this.setState({ offset: 0 });
    this.yelpSearch(0);
  }

  render() {
    const {
      yelpResults, restroomTypes, amenityTypes, markersData, selectedMarker, offset,
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
      <div className="Home container">
        <form onSubmit={this.firstSearch}>
          <button type="submit" className="search-btn btn btn-danger">Search Restrooms Near Me</button>
        </form>
        <div className="row">
          <div className="mapDiv col-5">
            <ScoopMap
            markersData={ markersData }
            findDude={ this.findDude }
            selectedMarker={ selectedMarker }/>
          { offset > 0 ? <button className="btn btn-danger" onClick={this.showPrevResults}>Previous</button> : ''}
          { yelpResults.length > 0 ? <button className="btn btn-success" onClick={this.showNextResults}>Next</button> : ''}
          </div>
          <div className="container col-7">
            <div className="result-component row">
            { resultComponents }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
