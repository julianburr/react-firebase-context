import React, { unstable_AsyncMode as AsyncMode } from 'react';
import ReactDOM from 'react-dom';
import { FirebaseProvider, FirestoreProvider } from 'react-firebase-context';
import App from './App';

import './index.css';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID
};

const container = document.getElementById('root');

ReactDOM.render(
  <AsyncMode>
    <FirebaseProvider {...firebaseConfig}>
      <FirestoreProvider>
        <App />
      </FirestoreProvider>
    </FirebaseProvider>
  </AsyncMode>,
  container
);
