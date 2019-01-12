import React, { Component } from 'react';
import AuthContext from './context';

class Auth extends Component {
  render () {
    return <AuthContext.Consumer>{this.props.children}</AuthContext.Consumer>;
  }
}

export default Auth;
