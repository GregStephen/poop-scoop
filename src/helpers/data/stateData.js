import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getStates = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/states.json`)
    .then((resp) => {
      const stateResults = resp.data;
      const statesToPrint = Object.keys(stateResults);
      resolve(statesToPrint);
    })
    .catch(err => reject(err));
});

const getCities = state => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/states.json`)
    .then((resp) => {
      const stateResults = resp.data;
      const cityResults = stateResults[state];
      resolve(cityResults);
    })
    .catch(err => reject(err));
});

export default { getStates, getCities };
