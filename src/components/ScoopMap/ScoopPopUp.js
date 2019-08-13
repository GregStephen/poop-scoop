import React from 'react';
import { Link } from 'react-router-dom';
import { Popup } from 'react-leaflet';

class ScoopPopUp extends React.Component {
  render() {
    const { marker } = this.props;
    const milesAway = Math.round((marker.distance / 1609.344) * 10) / 10;
    return (
        <Popup>
          <div className="popup">
          <img className="popup-image" src={marker.image} alt={marker.title}></img>
            <Link
              className="popup-business-name"
              to={{ pathname: marker.bizLink, search: marker.bizSearch }}>
              {marker.title}
            </Link>
            <p>{milesAway} miles away</p>
          </div>
        </Popup>
    );
  }
}

export default ScoopPopUp;
