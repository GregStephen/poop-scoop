import React from 'react';
import './App.scss';
import fbConnect from '../helpers/data/fbConnection';

fbConnect();

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <button className="btn btn-success">POOPSCOOOOOP</button>
      </div>
    );
  }
}

export default App;
