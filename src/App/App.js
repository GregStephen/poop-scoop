import React from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { ApolloProvider } from 'react-apollo';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import Auth from '../components/Auth/Auth';
import Home from '../components/Home/Home';
import User from '../components/User/User';
import Business from '../components/Business/Business';
import ReviewPage from '../components/ReviewPage/ReviewPage';
import NewUserPage from '../components/NewUserPage/NewUserPage';

import yelpClient from '../helpers/data/yelpData';

import './App.scss';
import fbConnect from '../helpers/data/fbConnection';

fbConnect();

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (authed === true
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }}/>)
  );
  return <Route {...rest} render={props => routeChecker(props)}/>;
};

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (authed === false
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/home', state: { from: props.location } }}/>)
  );
  return <Route {...rest} render={props => routeChecker(props)}/>;
};

class App extends React.Component {
  state = {
    authed: false,
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed } = this.state;
    return (
      <ApolloProvider client={yelpClient.client}r>
        <div className="App">
          <BrowserRouter>
            <React.Fragment>
              <MyNavbar authed={ authed }/>
              <Switch>
                <PublicRoute path='/auth' component={Auth} authed={authed}/>
                <PrivateRoute path='/home' component={Home} authed={authed}/>
                <PrivateRoute path='/user/:id' component={User} authed={authed}/>
                <Route path='/new-user' component={NewUserPage} authed={authed}/>
                <PrivateRoute path='/business/:yelpId' component={Business} authed={authed}/>
                <PrivateRoute path='/review/:yelpId' component={ReviewPage} authed={authed}/>
                <Redirect from='*' to='/auth'/>
              </Switch>
            </React.Fragment>
          </BrowserRouter>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
