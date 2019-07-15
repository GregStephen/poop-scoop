import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getBusinessesById = yelpId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/business.json?orderBy="yelpId"&equalTo="${yelpId}"`)
    .then((results) => {
      const bizResults = results.data;
      const businessess = [];
      if (bizResults !== null) {
        Object.keys(bizResults).forEach((bizId) => {
          bizResults[bizId].id = bizId;
          businessess.push(bizResults[bizId]);
        });
      }
      resolve(businessess[0]);
    })
    .catch(err => reject(err));
});

export default { getBusinessesById };
