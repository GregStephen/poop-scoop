import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getAvatars = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/avatars.json`)
    .then((resp) => {
      const avatars = resp.data;
      resolve(avatars);
    })
    .catch(err => reject(err));
});

export default { getAvatars };
