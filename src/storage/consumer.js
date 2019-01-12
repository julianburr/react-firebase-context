import React, { Component } from 'react';
import StorageContext from './context';

class Storage extends Component {
  render () {
    return (
      <StorageContext.Consumer>{this.props.children}</StorageContext.Consumer>
    );
  }
}

export default Storage;
