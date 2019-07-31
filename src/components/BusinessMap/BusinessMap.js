/* eslint-disable global-require */
import React from 'react';
import {
  Map, TileLayer, Marker,
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

class BusinessMap extends React.Component {
  state = {
    zoom: 14,
    latlng: {
      lat: 0,
      lng: 0,
    },
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

  render() {
    const businessMarker = (
      <Marker position={this.state.latlng}></Marker>
    );

    return (
      <div className="BusinessMap">
        <Map
        center={this.state.latlng}
        zoom={this.state.zoom}
        >
         <TileLayer
          attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {businessMarker}
        </Map>
        </div>
    );
  }
}

export default BusinessMap;
