# react-firebase-context

> **⚠️ This is currently still a prove of concept for using firebase APIs in a simple way in React projects … if you're looking for something production ready, check out [the official firebase-js-sdk](https://github.com/firebase/firebase-js-sdk) or [react-redux-firebase](http://react-redux-firebase.com/) for integration with redux**

The following is currently still a concept. None of the below API is integrated yet.

## Why?

I'm currently playing around with Google Firebase for some hobby side projects, and experimenting with some alternative ways to deal with firebase and even more data flows with firestore.

In the following some ideas that might come out of this...

## Firebase Provider

To provide firebase functionality across the app an easy context provider could be used for the firebase config. E.g.

```jsx
<FirebaseProvider
  apiKey={process.env.REACT_APP_FIREBASE_API_KEY}
  authDomain={process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}
  databaseURL={process.env.REACT_APP_FIREBASE_DB_URL}
  projectId={process.env.REACT_APP_FIREBASE_PROJECT_ID}
  storageBucket={process.env.REACT_APP_FIREBASE_BUCKET}
  messagingSenderId={process.env.REACT_APP_FIREBASE_SENDER_ID}
>
  <App />
</FirebaseProvider>
```

Then within the app diffferent consumers can be used for differernt parts of the firebase API:

### Auth

```jsx
<FirebaseAuth>
  {({auth, loginWithFacebook}) => auth.user ? (
    <p>Content...</p>
  ) : (
    <button onClick={loginWithFacebook}>
      Login with Facebook
    </button>
  )}
</FirebaseAuth>
```

### Firestore

```jsx
<FirebaseFirestore>
	{(data, firestore) => ...}
</FirebaseFirestore>
```

HOC that provides the firestore to the decorated component:

```jsx
@withFirestore
class Example extends React.Component {
  someMethod () {
    firestore.collection('example').add({
      foo: 'bar'
    });
  }
  
  render () {
    ...
  }
}
```

HOC to load data that then can be accessed via `<FirebaseFirestore />`:

```jsx
@load('users', [
  'users', 
  ['accounts', '==', props => props.accountId]
])
class Example extends React.Component {
  render () {
    return (
      <FirebaseFirestore>
        {({users}) => users.status === 'loaded' ? (
          <div>
          	<ul>
            	{users.data.map(user => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading users...</p>
        )}
      </FirebaseFirestore>
    );
  }
}
```

This way you can combine HOCs e.g. to load user data associated with the current auth user:

```jsx
@withFirebase
@load('user', [ 
  'users',
  ['authId', '==', props => props.firebase.auth.user.id]
])
class Example extends React.Component {
  render () {
    return (
      <FirebaseFirestore>
        {({user}) => user.status === 'loaded' ? (
          <p>Hello {user.data.name}!</p>
        ) : (
          <p>Loading user...</p>
        )}
      </FirebaseFirestore>
    );
  }
}
```

#### With React Suspense

With React Suspense the way to load and access data changes drastically (to the better 😄), so with that in mind it could look something like this:

```jsx
const userFetcher = createFetcher('users');
class Example extends React.Component {
  render () {
    const user = userFetcher('user', [
      ['authId', '==', this.props.authId]
    ]);
    return <p>Hello {user.name}!</p>;
  }
}

@withFirebase
class App extends React.Component {
  render () {
    return (
    	<div>
      	<Placeholder fallback={<p>Loading user...</p>}>
        	<Example 
            authId={this.props.firebase.auth.user.id} 
          />
        </Placeholder>
      </div>
    )
  }
}
```

## Data structure

In any case (suspense or not) the normalisation of the data would be the same and is crucial:

```js
const state = {
  docs: {
    [COLLECTION]: {
      [ID]: {
        data: DATA,
        ...meta
      }
    }
  },
  collections: {
    [COLLECTION]: {
      [FILTER HASH]: {
        items: [ID, ID, ID],
        pagination: PAGINATION,
        ...meta
      }
    }
  }
}
```

The idea is that when loading collections, those collections should be stored under a hash built from the query conditions and ordering. All individual items of the collection would be stored in the respective docs part of the store.

All collections and items would listen to snapshots to get live changes from the database!