import PropTypes from 'prop-types';

const yelpDataShape = PropTypes.shape({
  coordinates: PropTypes.object.isRequired,
  distance: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string,
});

export default { yelpDataShape };
