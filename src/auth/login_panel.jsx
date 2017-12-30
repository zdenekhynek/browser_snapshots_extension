import React from 'react';
import PropTypes from 'prop-types';

import classes from './login_panel.css';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLogoutClick(evt) {
    evt.preventDefault();
    this.props.logout();
  }

  render() {
    const { isAuthorized, username } = this.props;

    if (!isAuthorized) {
      return null;
    }

    return (
      <div className={classes.loginPanel}>
        <div className={classes.list}>
          <div className="">
            <i className="fa fa-user" />
            {username}
          </div>
          <div className="">
            <a
              className=""
              onClick={this.onLogoutClick}
            >
              <i className="fa fa-fw fa-sign-out" />
              Logout
            </a>
          </div>
        </div>
      </div>
    );
  }
}

LoginPanel.propTypes = {
  username: PropTypes.string,
  isAuthorized: PropTypes.bool,
  logout: PropTypes.func,
};
