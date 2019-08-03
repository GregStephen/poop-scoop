import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getStates = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/states.json`).then((resp) => {
    const stateResults = resp.data.states;
    resolve(stateResults);
  })
    .catch(err => reject(err));
});


export default { getStates };
