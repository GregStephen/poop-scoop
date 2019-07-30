import React from 'react';
import { Link } from 'react-router-dom';
import { Popup } from 'react-leaflet';

class ScoopPopUp extends React.Component {
  render() {
    const { markerData } = this.props;
    return (
      <div className="ScoopPopUp">
        <Popup
        >
          <div>
          <img className="popup-image" src={markerData.image} alt={markerData.title}></img>
            <Link
              to={{ pathname: markerData.bizLink, search: markerData.bizSearch }}>
              {markerData.title}
            </Link>
          </div>
        </Popup>
      </div>
    );
  }
}

export default ScoopPopUp;
