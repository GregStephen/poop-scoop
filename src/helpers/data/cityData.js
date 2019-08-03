import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getCities = state => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/cities/${state}.json`)
    .then((resp) => {
      const cityResults = resp.data;
      resolve(cityResults);
    })
    .catch(err => reject(err));
});

export default { getCities };
