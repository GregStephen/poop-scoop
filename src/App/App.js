import React from 'react';
import Home from '../components/Home/Home';

import './App.scss';
import fbConnect from '../helpers/data/fbConnection';

fbConnect();

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Home/>
        <button className="btn btn-success">POOPSCOOOOOP</button>
      </div>
    );
  }
}

export default App;
