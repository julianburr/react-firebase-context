import React, { Component, Fragment } from 'react';
import { Firestore } from 'react-firebase-context';
import Placeholder from './Placeholder';
import logo from './logo.svg';

import './App.css';

console.log('Placeholder', Placeholder);

class App extends Component {
  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload...
        </p>
        <Placeholder delayMs={100} fallback={<p>loading</p>}>
          <div>
            <p>Hello there</p>
            <Firestore
              query={({ firestore }) => {
                console.log('firestore', firestore);
                return [
                  firestore.collection('users'),
                  firestore
                    .collection('users')
                    .where('email', '==', 'max@mustermann.de'),
                  firestore.collection('users').doc('mxSyb7UPJl6OocQ2pSh7')
                ];
              }}
            >
              {({ data }) => (
                <Fragment>
                  <p>This is a firestore example</p>
                  <pre
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      overflow: 'auto'
                    }}
                  >
                    {JSON.stringify(
                      [
                        data[0].map(({ id, data }) => ({ id, data })),
                        data[1].map(({ id, data }) => ({ id, data })),
                        { id: data[2].id, data: data[2].data }
                      ],
                      null,
                      2
                    )}
                  </pre>
                </Fragment>
              )}
            </Firestore>
          </div>
        </Placeholder>
      </div>
    );
  }
}

export default App;
