import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getRestroomType = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/restroomType.json`)
    .then((resp) => {
      const restroomTypeResults = resp.data;
      const restroomTypes = [];
      if (restroomTypeResults !== null) {
        Object.keys(restroomTypeResults).forEach((rrId) => {
          restroomTypeResults[rrId].id = rrId;
          restroomTypes.push(restroomTypeResults[rrId]);
        });
      }
      resolve(restroomTypes);
    })
    .catch(err => reject(err));
});

export default { getRestroomType };
