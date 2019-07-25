/* eslint-disable global-require */
import React from 'react';
import L from 'leaflet';

import './Map.scss';

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

class Map extends React.Component {
  componentDidMount() {
    this.map = L.map('map', {
      zoom: 11,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });
    // this gets the users location and sets the view to it and zooms it in
    this.map.locate({ setView: true, maxZoom: 14 });
    this.layer = L.layerGroup().addTo(this.map);
    this.updateMarkers(this.props.markersData);

    const onLocationFound = (e) => {
      this.props.findDude(e.latlng);
      L.marker((e.latlng), { icon: userIcon }).addTo(this.map)
        .bindPopup('Here You Are').openPopup();
    };

    this.map.on('locationfound', onLocationFound);
  }

  componentDidUpdate({ markersData }) {
    if (this.props.markersData !== markersData) {
      this.updateMarkers(this.props.markersData);
    }
  }

  popUpData = marker => `<div><img style="max-width: 80%;" src="${marker.image}"></img><p>${marker.title}</p></div>`

  updateMarkers(markersData) {
    this.layer.clearLayers();
    markersData.forEach((marker) => {
      L.marker(marker.latLng, { title: marker.title })
        .addTo(this.layer).bindPopup(this.popUpData(marker));
    });
  }

  render() {
    return (
      <div className="Map" id="map">
      </div>
    );
  }
}

export default Map;
