import React, { Component } from 'react';
import AuthContext from './auth-context';

class Auth extends Component {
  render () {
    return <AuthContext.Consumer>{this.props.children}</AuthContext.Consumer>;
  }
}

export default Auth;
