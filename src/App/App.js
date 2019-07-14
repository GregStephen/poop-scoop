import React from 'react';
import { ApolloProvider } from 'react-apollo';
import Home from '../components/Home/Home';
import yelpClient from '../helpers/data/yelpData';


import './App.scss';
import fbConnect from '../helpers/data/fbConnection';

fbConnect();

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={yelpClient.client}r>
        <div className="App">
          <Home/>
          <button className="btn btn-success">POOPSCOOOOOP</button>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
