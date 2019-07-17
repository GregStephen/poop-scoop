import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getUserByUID = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/user.json?orderBy="uid"&equalTo="${uid}"`)
    .then((resp) => {
      const userResults = resp.data;
      const user = [];
      if (userResults !== null) {
        Object.keys(userResults).forEach((userId) => {
          userResults[userId].id = userId;
          user.push(userResults[userId]);
        });
      }
      resolve(user[0]);
    })
    .catch(err => reject(err));
});

const postUser = userObj => axios.post(`${firebaseUrl}/user.json`, userObj);

const getUserById = id => axios.get(`${firebaseUrl}/user/${id}.json`);

const deleteUser = id => axios.delete(`${firebaseUrl}/user/${id}.json`);

export default
{
  getUserByUID,
  postUser,
  getUserById,
  deleteUser,
};
