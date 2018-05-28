import React, { Component, Fragment } from 'react';
import { Auth } from 'react-firebase-context';

import './App.css';

class App extends Component {
  render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Firebase Context Example</h1>
        </header>
        <Auth>
          {({ user, loginWithGoogle, logout, ready }) =>
            ready ? user ? (
              <Fragment>
                <p>Hello {user.displayName}!</p>
                <button onClick={logout}>Logout</button>
              </Fragment>
            ) : (
              <button onClick={loginWithGoogle}>Login with Google</button>
            ) : (
              <p>Initialising app...</p>
            )}
        </Auth>
      </div>
    );
  }
}

export default App;
