/* eslint-disable global-require */
import React, { createRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

import ScoopPopUp from './ScoopPopUp';

const ratedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  popupAnchor: [10, 0],
});

const unratedIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  popupAnchor: [10, 0],
});

class ScoopMarker extends React.Component {
  markerRef = createRef();

  componentDidUpdate({ selectedMarker }) {
    if (this.props.selectedMarker !== selectedMarker) {
      if (this.props.selectedMarker === this.props.marker.key) {
        const thisMarker = this.markerRef.current;
        thisMarker.leafletElement.openPopup();
        const { setView, marker } = this.props;
        setView(marker.latlng);
      }
    }
  }

  render() {
    const { marker } = this.props;
    return (
      <Marker
          key={marker.key}
          id={marker.key}
          position={marker.latlng}
          ref={this.markerRef}
          icon={marker.isRated ? ratedIcon : unratedIcon}
          >
            <ScoopPopUp
            marker={marker}
           />
          </Marker>
    );
  }
}

export default ScoopMarker;
