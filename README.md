# react-firebase-context

This is an experimental package, which aims to make dealing with Google Firebase services easier in React apps, espacially the data flow side of things.

Since its completely experimental, I decided to work the new React Suspense feature into the data flow handling, which seems to be the right way to go. That being said, besides the obvious warning that this should NOT be used in production apps, also be warned here that this will (currently) only work with the alpha build of React (`yarn add react@canary react-dom@canary`) due to those experimental features.

## Why?

Dealing with data flows of any kind is always a huge pain in the butt. With this library I am trying to make it a bit simpler and less painful.

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

### Firebase

The general setup to contect your app to your Firebase project is done by the `FirebaseProvider`, which takes all the config that you would usually pass to Firebase as props:

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

This literally just runs `firebase.initializeApp` in the constructor, which allows you to access all the services Firebase offers. That also means that all service providers need to be placed within this `FirebaseProvider`.

### Firestore

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
	{({data}) => (
  	<Fragment>
      <h1>Users</h1>
    	<ul>
    		{data.map(user => (
          <li key={user.id}>{user.data.name}</li>
        )}
    	</ul>
    </Fragment>
  )}
</Firestore>
```

In the core it will load the data from Firestore (using React Suspense to suspend the render until the data is loaded) and then store the data in the cache. It will keep listening to snapshot changes, so you'll always get the latest data. It will also, when the query is a list, store all individual items in the cache as well. So when an entity was in a list before, loading it invidually will be instant, no request to the Firebase server will be made 😊

### Auth

_Work in progress_

## Todo

- [ ] Finish firestore components

- [ ] Add auth components for easier authentication flows / access of authentication data via context provider and consumer

- [ ] Add similar structures for other components

- [ ] Change build structure to be able to serve different services individually

  ```js
  import { FirebaseProvider } from 'react-firebase-context';
  import { FirestoreProvider, Firestore } from 'react-firebase-context/firestore';
  ```
