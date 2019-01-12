import React, { Component } from 'react';
import StorageContext from './context';

const withStorage = (WrappedComponent) =>
  class WithStorage extends Component {
    render () {
      return (
        <StorageContext.Consumer>
          {({ storage }) => {
            return <WrappedComponent storage={storage} {...this.props} />;
          }}
        </StorageContext.Consumer>
      );
    }
  };

export default withStorage;
