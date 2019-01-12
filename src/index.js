import React, { Component, createContext } from 'react';
import firebase from 'firebase/app';
import { autobind } from 'core-decorators';

import { AuthContext, AuthProvider, withAuth, Auth } from './auth/index.js';
import {
  FirestoreContext,
  FirestoreProvider,
  Firestore,
  withFirestore
} from './firestore/index.js';
import {
  StorageContext,
  StorageProvider,
  withStorage,
  Storage
} from './storage/index.js';

const FirebaseContext = createContext({});

let initialised = false;

@autobind
class FirebaseProvider extends Component {
  constructor (props) {
    super(props);

    const config = this.getConfig(props);
    this.state = {
      config
    };

    if (!initialised) {
      firebase.initializeApp(config);
      initialised = true;
    }
  }

  getConfig (props) {
    return {
      apiKey: props.apiKey,
      authDomain: props.authDomain,
      databaseURL: props.databaseURL,
      projectId: props.projectId,
      storageBucket: props.storageBucket,
      messagingSenderId: props.messagingSenderId
    };
  }

  render () {
    return (
      <FirebaseContext.Provider value={this.state}>
        {this.props.children}
      </FirebaseContext.Provider>
    );
  }
}

export {
  FirebaseContext,
  FirebaseProvider,
  FirestoreContext,
  FirestoreProvider,
  Firestore,
  withFirestore,
  AuthContext,
  AuthProvider,
  withAuth,
  Auth,
  StorageContext,
  StorageProvider,
  withStorage,
  Storage
};
