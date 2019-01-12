import React, { Fragment, ConcurrentMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  FirebaseProvider,
  AuthProvider,
  FirestoreProvider,
  StorageProvider
} from 'react-firebase-context';
import App from 'src/app';
import { init as initTheme } from 'src/theme';

const GlobalStyles = initTheme();

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
  <ConcurrentMode>
    <FirebaseProvider {...firebaseConfig}>
      <AuthProvider>
        <FirestoreProvider>
          <StorageProvider>
            <BrowserRouter>
              <Fragment>
                <GlobalStyles />
                <App />
              </Fragment>
            </BrowserRouter>
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </FirebaseProvider>
  </ConcurrentMode>,
  container
);
