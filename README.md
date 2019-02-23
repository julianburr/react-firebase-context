![logo](./logo.svg)

<br />

# react-firebase-context

![npm](https://img.shields.io/npm/v/react-firebase-context.svg?style=for-the-badge) ![license](https://img.shields.io/github/license/julianburr/react-firebase-context.svg?style=for-the-badge)

This is an experimental package, which aims to make dealing with Google Firebase services easier in React apps, espacially the data flow side of things.

Since its completely experimental, I decided to work the new React Suspense feature into the data flow handling, which seems to be the right way to go. That being said, besides the obvious warning that this should NOT be used in production apps, also be warned here that this will (currently) only work with the alpha build of React (`yarn add react@canary react-dom@canary`) due to those experimental features.

## Why?

Dealing with data flows of any kind is always a huge pain in the a\**. With this library I am trying to make it a bit simpler and less painful.

The general concept is to have everything Firebase related (or any of its services) stored and passed through to your components via the React Context API.

## Install

```bash
yarn add react-firebase-context

# Or via npm
npm i react-firebase-context
```

## Example

To make things easier to understand I am trying to build up a demo application with CRA as I go. This can be found in the `example` directory. Do the following to run it:

```bash
cd example
yarn && yarn start
```

## Usage

The general setup to connect your app to your Firebase project is done by the `FirebaseProvider`, which takes all the config that you would usually pass to Firebase as props:

```jsx
<FirebaseProvider 
  apiKey={apiKey}
  authDomain={authDomain}
  databaseURL={props.databaseURL}
  projectId={props.projectId}
  storageBucket={props.storageBucket}
  messagingSenderId={props.messagingSenderId}
>
  <App />
</FirebaseProvider>
```

This literally just runs `firebase.initializeApp` in the constructor, which allows you to access all the services Firebase offers. That also means that all service providers need to be placed within this `FirebaseProvider`. It's generally a good idea to store this sensitive information in your projects `.env` file or similar. With CRA you can then access them via `process.env.REACT_APP_*`.

### Firestore

[Firebase Documentation for Firestore](https://firebase.google.com/docs/firestore/quickstart)

To set up the data context (which serves as cache) you need to use the `FirestoreProvider`. It takes all config arguments that you would usually pass into `firestore.settings` as props.

```jsx
<FirebaseProvider {...config}>
  <FirestoreProvider>
    <App />
  </FirestoreProvider>
</FirebaseProvider>
```

Within your app you can then either use the HoC to get access to the Firestore instance ...

```jsx
@withFirestore
class Example extends React.Component {
  componentDidMount () {
    this.props.firestore.firestore // = firestore instance
    this.props.firestore.data // = data cache
  }
}
```

… or use the `Firestore` component, which let's you define queries that it will automatically try to resolve.

```jsx
<Firestore query={({firestore}) => firestore.collection('users')}>
  {({data, firestore}) => (
    <Fragment>
      <h1>Users</h1>
      <ul>
        {data.map(user => (
          <li key={user.id} onClick={() => firestore.collection('users').doc(user.id).delete()}>
            {user.data.name}
          </li>
        ))}
      </ul>
    </Fragment>
  )}
</Firestore>
```

In the core it will load the data from Firestore (using React Suspense to suspend the render until the data is loaded) and then store the data in the cache. It will keep listening to snapshot changes, so you'll always get the latest data. It will also, when the query is a list, store all individual items in the cache as well. So when an entity was in a list before, loading it invidually will be instant, no request to the Firebase server will be made 😊

### Auth

[Firebase Documentation for Authentication](https://firebase.google.com/docs/auth/web/start)

Setup again through provider component, which initialises the listener for authentication changes.

```jsx
<FirebaseProvider {...config}>
  <AuthProvider>
    <App />
  </AuthProvider>
</FirebaseProvider>
```

The actual auth data and functionality can then accessed via HoC ...

```jsx
@withAuth
class Example extends React.Component {
  componentDidMount () {
    this.props.auth.getUserData // = get auth user data, or null if user is not logged in
    this.props.auth.loginWith* // = auth methods for different providers
    this.props.auth.logout // = logout method
  }
}
```

... or consumer component

```jsx
<Suspense fallback={<p>Init app...</p>}>
  <Auth>
    {({getUserData, loginWithGoogle, logout}) => {
      const user = getUserData();
      return !user ? (
        <button onClick={loginWithGoogle}>
          Login with Google
        </button>
      ) : (
        <Fragment>
          <p>Hello {user.displayName}!</p>
          <button onClick={logout}>Logout</button>
      )}
    }
  </Auth>
</Suspense>
```

The auth consumer (component and HoC) will suspend its rendering until it gets the initial user data when using `getUserData`. By using Suspense you can decide where and how you want to handle that initial state.

### Storage

[Firebase Documentation for Storage](https://firebase.google.com/docs/storage/)

Same setup as for the other services. Use the storage provider wrapping everything in your app that needs access to the storage service functionality.

```jsx
<FirbaseProvider {...config}>

</FirebaseProvider>
```

To get access to the storage functionality, you can use the HoC ...

```jsx
@withStorage
class Example extends React.Component {
  componentDidMount () {
    this.props.storage // = firebase.storage()
  }
}
```

... or the consumer component

```jsx
<Storage>
  {({storage}) => (
    <form ref={e => this.form = e}>
      <input
        type="file"
        onChange={e => {
          const file = e.target.files[0];
          if (file) {
            storage.ref().child(file.name).put(file).then(() => {
              this.form.reset();
            })
          }
        }}
      />
    </form>
  )}
</Storage>
```

Note that in the documentation it is recommended to keep information regarding your storage in a database structure (i.e. Firestore), since Firebase Storage does not provide an API to query or even list directories or files based on certain criteria (other than their full path).

### Functions / ML Kit

_Work in progress_

## Todo

- [x] ~~Finish firestore components~~
- [x] ~~Add auth components for easier authentication flows / access of authentication data via context provider and consumer~~
- [x] ~~Add support for storage service~~
- [x] ~~Allow defining auth provider settings (e.g. scopes) via props / args in the auth methods~~
- [ ] Add similar structures for other services (Functions, ML Kit, ...)
- [ ] Use hooks where sensible
- [ ] Change build structure to be able to serve different services individually allowing tree-shaking unused services away
  ```js
  import { FirebaseProvider } from 'react-firebase-context';
  import { FirestoreProvider, Firestore } from 'react-firebase-context/firestore';
  ```
