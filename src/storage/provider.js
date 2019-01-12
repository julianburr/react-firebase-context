import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import firebase from 'firebase/app';
import invariant from 'invariant';
import StorageContext from './context';

import 'firebase/storage';

@autobind
class StorageProvider extends Component {
  constructor () {
    super();
    this.storage = firebase.storage();
  }

  render () {
    return (
      <StorageContext.Provider
        value={{
          storage: this.storage
        }}
      >
        {this.props.children}
      </StorageContext.Provider>
    );
  }
}

export default StorageProvider;
