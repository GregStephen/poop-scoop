/* eslint-disable global-require */
import React, { createRef } from 'react';
import {
  Map, TileLayer, Marker, Popup,
} from 'react-leaflet';
import L from 'leaflet';

import './BusinessMap.scss';

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
  popupAnchor: [20, -15],
});

class BusinessMap extends React.Component {
  state = {
    zoom: 14,
    latlng: {
      lat: 0,
      lng: 0,
    },
    userLocation: {
      lat: 0,
      lng: 0,
    },
    hasLocation: false,
  }

  myRef = createRef();

  componentDidMount() {
    const map = this.myRef.current;
    if (map != null) {
      map.leafletElement.locate();
    }
  }

  componentDidUpdate({ yelpResults }) {
    if (this.props.yelpResults !== yelpResults) {
      this.setState({
        latlng:
        {
          lat: this.props.yelpResults.coordinates.latitude,
          lng: this.props.yelpResults.coordinates.longitude,
        },
      });
    }
  }

  handleLocationFound = (e) => {
    this.props.findDude(e.latlng);
    this.setState({
      hasLocation: true,
      userLocation: e.latlng,
    });
  }

  render() {
    const businessMarker = (
      <Marker position={this.state.latlng}></Marker>
    );

    const userMarker = (
    <Marker
    position={this.state.userLocation}
    icon={userIcon}
    >
      <Popup>You are here</Popup>
    </Marker>
    );

    return (
      <div className="BusinessMap">
        <Map
        ref={this.myRef}
        center={this.state.latlng}
        zoom={this.state.zoom}
        onLocationfound={this.handleLocationFound}
        >
         <TileLayer
          attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {businessMarker}
        {userMarker}
        </Map>
        </div>
    );
  }
}

export default BusinessMap;
