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
import EditReview from '../components/EditReview/EditReview';
import NewUserPage from '../components/NewUserPage/NewUserPage';

import yelpClient from '../helpers/data/yelpData';
import userData from '../helpers/data/userData';

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
    userObj: {
      name: 'Greg',
    },
  }

  getUser = () => {
    if (this.state.authed) {
      const firebaseId = firebase.auth().currentUser.uid;
      userData.getUserByUID(firebaseId)
        .then(userObj => this.setState({ userObj }))
        .catch(err => console.error('trouble fetching user data', err));
    }
  }

  createUser = (saveMe) => {
    userData.postUser(saveMe)
      .then(() => {
        this.getUser();
      })
      .catch();
  }

  updateUser = (userObj, userId) => {
    userData.putUser(userObj, userId)
      .then(() => {
        this.getUser();
      }).catch();
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userData.getUserByUID(user.uid)
          .then((userObj) => {
            this.setState({ userObj });
            this.setState({ authed: true });
          })
          .catch(err => console.error('trouble fetching user data', err));
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed, userObj } = this.state;
    return (
      <ApolloProvider client={yelpClient.client}r>
        <div className="App">
          <BrowserRouter>
            <React.Fragment>
              <MyNavbar authed={ authed } userObj={ userObj } getUser={ this.getUser }/>
              <Switch>
                <PublicRoute path='/auth' component={Auth} authed={authed}/>
                <PrivateRoute path='/home' component={Home} authed={authed}/>
                <PrivateRoute path='/user/:id' component={User} authed={authed} updateUser={this.updateUser}/>
                <Route path='/new-user' component={NewUserPage} authed={authed} createUser={ this.createUser }/>
                <PrivateRoute path='/business/:yelpId' component={Business} authed={authed}/>
                <PrivateRoute path='/review/:yelpId' component={ReviewPage} authed={authed}/>
                <PrivateRoute path='/edit-review/:yelpId' component={EditReview} authed={authed}/>
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
