import React, { PureComponent, Suspense, Fragment } from 'react';
import { Auth, Firestore, Storage } from 'react-firebase-context';

import UserProjects from './projects';
import UserFiles from './files';

class App extends PureComponent {
  render () {
    return (
      <Fragment>
        <h1>Example App</h1>
        <Suspense fallback={<p>Loading app....</p>}>
          <Auth>
            {({ getUserData, loginWithGoogle, logout }) => {
              const user = getUserData();
              if (user) {
                return (
                  <Fragment>
                    <p>You are logged in!</p>
                    <button onClick={logout}>Logout</button>

                    <Suspense fallback={<p>Loading user data...</p>}>
                      <UserProjects />
                      <UserFiles />
                    </Suspense>
                  </Fragment>
                );
              }
              return (
                <Fragment>
                  <p>You are not logged in!</p>
                  <button onClick={loginWithGoogle}>Login With Google</button>
                </Fragment>
              );
            }}
          </Auth>
        </Suspense>
      </Fragment>
    );
  }
}

export default App;
