import React from 'react';
import { Link } from 'react-router-dom';
import { Popup } from 'react-leaflet';

class ScoopPopUp extends React.Component {
  render() {
    const { marker } = this.props;
    return (
        <Popup
        >
          <div>
          <img className="popup-image" src={marker.image} alt={marker.title}></img>
            <Link
              to={{ pathname: marker.bizLink, search: marker.bizSearch }}>
              {marker.title}
            </Link>
          </div>
        </Popup>
    );
  }
}

export default ScoopPopUp;
