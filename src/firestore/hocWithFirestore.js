import React, { Component } from 'react';
import autoBind from 'auto-bind';
import FirestoreContext from './context';

const hocWithFirestore = WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
      autoBind.react(this);
    }
    render() {
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
};

export default hocWithFirestore;
