import React, { createRef } from 'react';
import { Marker } from 'react-leaflet';

import ScoopPopUp from './ScoopPopUp';

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
          >
            <ScoopPopUp
            marker={marker}
           />
          </Marker>
    );
  }
}

export default ScoopMarker;
