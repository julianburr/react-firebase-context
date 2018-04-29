import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const FireBaseContext = React.createContext({});

class FireBaseProvider extends Component {
  constructor (props) {
    super(props);

    this.initApp = this.initApp.bind(this);
    this.initAuth = this.initAuth.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithProvider = this.loginWithProvider.bind(this);
    this.logout = this.logout.bind(this);
    this.load = this.load.bind(this);

    this.state = {
      ready: false,
      config: props,
      user: null,
      data: {} // could potentially use local storage as cache here?!
    };

    this.initApp(props);
    this.initAuth();
  }

  initApp (props) {
    // Initialize Firebase
    const {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId
    } = props;
    firebase.initializeApp({
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId
    });
  }

  initAuth () {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user status changed', user);
      if (user) {
        console.log('user logged in', user);
        this.setState({ ready: true, user });
      } else {
        console.log('user logged out', user);
        this.setState({ ready: true, user: null });
      }
    });
    return firebase.auth().currentUser;
  }

  loginWithGoogle () {
    console.log('clicked');
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    // TODO: control scope either via args or props on the Provider...
    googleProvider.addScope(
      'https://www.googleapis.com/auth/contacts.readonly'
    );
    return this.loginWithProvider(googleProvider);
  }

  loginWithFacebook () {
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    facebookProvider.addScope('user_birthday');
    return this.loginWithProvider(facebookProvider);
  }

  loginWithProvider (provider) {
    return firebase.auth().signInWithPopup(provider);
  }

  logout () {
    return firebase.auth().signOut();
  }

  load (hash, loader) {
    const that = this;
    that.setState({
      data: {
        ...that.state.data,
        [hash]: {
          status: 'loading',
          data: null,
          error: null
        }
      }
    });
    loader(firebase.firestore())
      .then((result) => {
        that.setState({
          data: {
            ...that.state.data,
            [hash]: {
              status: 'loaded',
              data: result,
              error: null
            }
          }
        });
      })
      .catch((e) => {
        that.setState({
          data: {
            ...that.state.data,
            [hash]: {
              status: 'error',
              data: null,
              error: e
            }
          }
        });
      });
  }

  render () {
    console.log('this.state', this.state);
    return (
      <FireBaseContext.Provider
        value={{
          ...this.state,
          loginWithGoogle: this.loginWithGoogle,
          loginWithFacebook: this.loginWithFacebook,
          logout: this.logout,
          load: this.load,
          db: firebase.firestore()
        }}
      >
        {this.props.children}
      </FireBaseContext.Provider>
    );
  }
}

const withFireBase = (WrappedComponent) =>
  class WithFireBase extends Component {
    render () {
      return (
        <FireBaseContext.Consumer>
          {(firebase) => (
            <WrappedComponent {...this.props} firebase={firebase} />
          )}
        </FireBaseContext.Consumer>
      );
    }
  };

class Loader extends Component {
  constructor (props) {
    super(props);
    this.load = this.load.bind(this);
    this.load(props);
  }

  load (props) {
    const { hash, load, firebase } = props;
    if (!firebase.data[hash] || firebase.data[hash].status === 'error') {
      firebase.load(hash, load);
    }
  }

  render () {
    const { children, hash, firebase } = this.props;
    const item = firebase.data[hash];
    return (
      <Fragment>
        {children(item ? item : { status: 'loading', data: null, error: null })}
      </Fragment>
    );
  }
}

Loader = withFireBase(Loader);

export { FireBaseProvider, FireBaseContext, withFireBase, Loader };
