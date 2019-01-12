import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import firebase from 'firebase/app';
import AuthContext from './context';

import 'firebase/auth';

@autobind
class AuthProvider extends Component {
  constructor (props) {
    super(props);

    this.state = {
      user: firebase.auth().currentUser,
      ready: false
    };

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged((user) => {
      const isReady = this.state.ready;
      if (!isReady || user !== this.state.user) {
        this.setState(
          { user, ready: true },
          !isReady ? () => this.resolve() : () => {}
        );
      }
    });
  }

  loginWithProvider (provider) {
    return firebase.auth().signInWithPopup(provider);
  }

  loginWithGoogle (options) {
    const { scope } = options || {};
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope(
      `https://www.googleapis.com/auth/${scope || 'contacts.readonly'}`
    );
    return this.loginWithProvider(googleProvider);
  }

  loginWithFacebook (options) {
    const { scope } = options || {};
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    facebookProvider.addScope(scope || 'user_birthday');
    return this.loginWithProvider(facebookProvider);
  }

  logout () {
    return firebase.auth().signOut();
  }

  getUserData () {
    const { user, ready } = this.state;
    if (ready) {
      return user;
    }
    throw this.promise;
  }

  render () {
    return (
      <AuthContext.Provider
        value={{
          getUserData: this.getUserData,
          loginWithProvider: this.loginWithProvider,
          loginWithGoogle: this.loginWithGoogle,
          loginWithFacebook: this.loginWithFacebook,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
