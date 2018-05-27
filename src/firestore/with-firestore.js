import React, { Component } from 'react';
import FirestoreContext from './firestore-context';

const withFirestore = (WrappedComponent) =>
  class WithFirestore extends Component {
    render () {
      return (
        <FirestoreContext.Consumer>
          {(value) => <WrappedComponent firestore={value} {...this.props} />}
        </FirestoreContext.Consumer>
      );
    }
  };

export default withFirestore;
