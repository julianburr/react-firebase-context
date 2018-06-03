import React, { Component } from 'react';
import FirestoreContext from './firestore-context';

const withFirestore = (WrappedComponent) =>
  class WithFirestore extends Component {
    render () {
      return (
        <FirestoreContext.Consumer>
          {({ firestore, data, query }) => {
            firestore.data = data;
            firestore.query = query;
            return <WrappedComponent firestore={firestore} {...this.props} />;
          }}
        </FirestoreContext.Consumer>
      );
    }
  };

export default withFirestore;
