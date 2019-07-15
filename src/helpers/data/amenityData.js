import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getAmenitiesByBusinessId = businessId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/amenities.json?orderBy="businessId"&equalTo="${businessId}"`)
    .then((resp) => {
      const amenitiesResults = resp.data;
      const amenities = [];
      if (amenitiesResults !== null) {
        Object.keys(amenitiesResults).forEach((amenId) => {
          amenitiesResults[amenId].id = amenId;
          amenities.push(amenitiesResults[amenId]);
        });
      }
      resolve(amenities);
    })
    .catch(err => reject(err));
});

export default { getAmenitiesByBusinessId };
