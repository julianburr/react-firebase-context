import React, { Component } from 'react';
import AuthContext from './context';

const withAuth = (WrappedComponent) =>
  class WithAuth extends Component {
    render () {
      return (
        <AuthContext.Consumer>
          {(value) => <WrappedComponent auth={value} {...this.props} />}
        </AuthContext.Consumer>
      );
    }
  };

export default withAuth;
