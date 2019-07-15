import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getAmenityTypes = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/amenityType.json`)
    .then((resp) => {
      const amenityType = resp.data;
      resolve(amenityType);
    })
    .catch(err => reject(err));
});

export default { getAmenityTypes };
