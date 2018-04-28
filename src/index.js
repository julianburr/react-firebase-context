import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const FireBaseContext = React.createContext({});

class FireBaseProvider extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
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
        this.setState({ user });
      } else {
        console.log('user logged out', user);
        this.setState({ user: null });
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
          loadDocument: this.loadDocument
        }}
      >
        {this.props.children}
      </FireBaseContext.Provider>
    );
  }
}

const withFireBase = (WrappedComponent) =>
  class WithFireBase extends PureComponent {
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

export { FireBaseProvider, FireBaseContext, withFireBase };
