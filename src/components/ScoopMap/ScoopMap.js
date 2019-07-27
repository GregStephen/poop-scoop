/* eslint-disable global-require */
import React, { createRef, Component } from 'react';
import {
  Map, TileLayer, Marker, Popup,
} from 'react-leaflet';
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

// const MyPopupMarker = ({ content, latlng }) => (
//   <Marker position={latlng}>
//     <Popup>{content}</Popup>
//   </Marker>
// );

// const MyMarkersList = ({ markers }) => {
//   const items = markers.map(({ key, ...props }) => (
//     <MyPopupMarker key={key} {...props} />
//   ));
//   return <Fragment>{items}</Fragment>;
// };


class ScoopMap extends Component {
  state = {
    hasLocation: false,
    latlng: {
      lat: 36.129,
      lng: -86.67,
    },
    zoom: 13,
  }

  myRef = createRef();


  updateMarkers = () => {
    const { markersData } = this.props;
    if (markersData !== undefined) {
      console.error(markersData);
      markersData.map(markerD => (
    <Marker
    key={markerD.title}
    position={markerD.latlng}
    icon={userIcon}
    ><Popup><div><p>{markerD.tite}</p></div></Popup>
    </Marker>
      ));
    }
  };

  componentDidMount() {
    const map = this.myRef.current;
    if (map != null) {
      map.leafletElement.locate();
      this.updateMarkers();
    }
  }

  componentDidUpdate({ markersData }) {
    if (this.props.markersData !== markersData) {
      console.error('update');
      this.updateMarkers(this.props.markersData);
    }
  }

  handleLocationFound = (e) => {
    console.error(e);
    this.props.findDude(e.latlng);
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
    });
  }

  render() {
    const marker = this.state.hasLocation ? (
      <Marker
      position={this.state.latlng}
      icon={userIcon}
      >
        <Popup>You are here</Popup>
      </Marker>
    ) : null;

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
      {marker}
      {this.updateMarkers()}
      </Map>
      </div>
    );
  }
}

export default ScoopMap;
