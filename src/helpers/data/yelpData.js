import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';

import yelpApi from '../apiKeys.json';

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = yelpApi.YelpKeys.apiKey;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Accept-Language': 'en-US',
    },
  };
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
});

const searchBusinessesByTerm = (latitude, longitude) => new Promise((resolve, reject) => {
  client
    .query({
      query: gql`
    query {
      search(
        latitude: ${latitude},
        longitude: ${longitude},
        radius: 3000,
        sort_by: "distance") {
        total
        business {
          id
          name
          location {
            address1
            city
            state
            postal_code
          }
          phone
          coordinates {
            latitude
            longitude
          }
          distance
          photos
        }
      }
    }
    `,
    }).then((res) => {
      resolve(res.data.search.business);
    })
    .catch(err => reject(err));
});

const getSingleBusiness = yelpId => new Promise((resolve, reject) => {
  client.query({
    query: gql`
    query {
      business(id: "${yelpId}") {
        name
        location {
          address1
          city
          state
          postal_code
        }
        phone
        coordinates {
          latitude
          longitude
        }
        photos
      }
    }
    `,
  }).then((res) => {
    resolve(res.data.business);
  }).catch(err => reject(err));
});

export default { searchBusinessesByTerm, client, getSingleBusiness };
