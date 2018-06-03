import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import firebase from 'firebase/app';
import AuthContext from './auth-context';

import 'firebase/auth';

@autobind
class AuthProvider extends Component {
  constructor (props) {
    super(props);

    this.state = {
      user: firebase.auth().currentUser,
      ready: false
    };
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== this.state.user) {
        this.setState({
          user,
          ready: true
        });
      }
    });
  }

  loginWithProvider (provider) {
    return firebase.auth().signInWithPopup(provider);
  }

  loginWithGoogle () {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
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

  logout () {
    return firebase.auth().signOut();
  }

  render () {
    return (
      <AuthContext.Provider
        value={{
          ...this.state,
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
