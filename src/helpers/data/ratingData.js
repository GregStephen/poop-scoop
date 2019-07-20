import axios from 'axios';
import fbApiKeys from '../apiKeys.json';

const firebaseUrl = fbApiKeys.firebaseKeys.databaseURL;

const getRatingByBusinessId = businessId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/businessRating.json?orderBy="businessId"&equalTo="${businessId}"`)
    .then((results) => {
      const reviewResults = results.data;
      const reviews = [];
      if (reviewResults !== null) {
        Object.keys(reviewResults).forEach((reviewId) => {
          reviewResults[reviewId].id = reviewId;
          reviews.push(reviewResults[reviewId]);
        });
      }
      resolve(reviews);
    })
    .catch(err => reject(err));
});

const getRatingByUserId = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/businessRating.json?orderBy="uid"&equalTo="${uid}"`)
    .then((results) => {
      const reviewResults = results.data;
      const reviews = [];
      if (reviewResults !== null) {
        Object.keys(reviewResults).forEach((reviewId) => {
          reviewResults[reviewId].id = reviewId;
          reviews.push(reviewResults[reviewId]);
        });
      }
      resolve(reviews);
    })
    .catch(err => reject(err));
});

const addNewReview = review => axios.post(`${firebaseUrl}/businessRating.json`, review);

const deleteReviewFromDatabase = id => axios.delete(`${firebaseUrl}/businessRating/${id}.json`);

export default {
  getRatingByBusinessId, getRatingByUserId, addNewReview, deleteReviewFromDatabase,
};
