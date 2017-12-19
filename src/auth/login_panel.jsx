import React from 'react';
import { connect } from 'react-redux';

import { login } from './action_creators';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLogoutClick() {
    this.props.logout();
  }

  render() {
    const { isAuthorized, username } = this.props;

    if (!isAuthorized) {
      return null;
    }

    return (
      <div>
        Logged in as: {username}
        <button onClick={this.onLogoutClick}>Log out</button>
      </div>
    );
  }
}
