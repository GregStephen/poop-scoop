/* eslint-disable max-len */
/* eslint-disable global-require */
import React, { createRef, Component } from 'react';
import {
  Map, TileLayer, Marker, Popup,
} from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

import './ScoopMap.scss';

// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const userIcon = L.icon({
  iconUrl: 'https://image.flaticon.com/icons/svg/10/10601.svg',
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),


  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [2, 50],
  shadowAnchor: [10, 45],
  popupAnchor: [20, -30],
});

class ScoopMap extends Component {
  state = {
    hasLocation: false,
    latlng: {
      lat: 0,
      lng: 0,
    },
    zoom: 13,
    markersData: [],
    selectedMarker: '',
  }

  myRef = createRef();

  componentDidMount() {
    const map = this.myRef.current;
    if (map != null) {
      map.leafletElement.locate();
    }
  }

  componentDidUpdate({ markersData, selectedMarker }) {
    if (this.props.markersData !== markersData) {
      this.setState({ markersData: this.props.markersData });
    }
    if (this.props.selectedMarker !== selectedMarker) {
      this.setState({ selectedMarker: this.props.selectedMarker });
    }
  }

  handleLocationFound = (e) => {
    this.props.findDude(e.latlng);
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
    });
  }

  popItUp = () => {
    const { selectedMarker } = this.props;
    if (selectedMarker !== '') {
      const popThis = document.getElementById(selectedMarker);
      console.error(popThis);
    }
  }

  render() {
    // const map = this.myRef.current;
    const updateMarkers = () => {
      const { markersData } = this.state;
      if (markersData.length > 0) {
        const markersToShow = markersData.map(markerD => (
          <Marker
          key={markerD.key}
          id={markerD.key}
          position={markerD.latlng}
          ref={markerD.key}
          >
            <Popup
            key={markerD.key}
            >
              <div>
              <img className="popup-image" src={markerD.image} alt={markerD.title}></img>
                <Link to={{ pathname: markerD.bizLink, search: markerD.bizSearch }}>{markerD.title}</Link>
              </div>
            </Popup>
          </Marker>
        ));
        return markersToShow;
      }
      return null;
    };

    const userMarker = (
      <Marker
      position={this.state.latlng}
      icon={userIcon}
      >
        <Popup>You are here</Popup>
      </Marker>
    );

    return (
      <div className="ScoopMap">
      <Map
      ref={this.myRef}
      center={this.state.latlng}
      zoom={this.state.zoom}
      onLocationfound={this.handleLocationFound}
      >
        <TileLayer
          attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {userMarker}
      {updateMarkers()}
      {this.popItUp()}
      </Map>
      </div>
    );
  }
}

export default ScoopMap;
