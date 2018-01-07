import React from 'react';
import PropTypes from 'prop-types';

import classes from './login_panel.css';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onAgentChange = this.onAgentChange.bind(this);
  }

  onLogoutClick(evt) {
    evt.preventDefault();
    this.props.logout();
  }

  onAgentChange(evt) {
    this.props.onAgentChange(evt.target.value);
  }

  renderAgentsDropdown(agents) {
    return (
      <select name="agents" onChange={this.onAgentChange}>
        {agents.map((agent) => {
          return (<option value={agent.id}>{agent.name}</option>);
        })}
      </select>
    );
  }

  render() {
    const { isAuthorized, username, agents } = this.props;

    if (!isAuthorized) {
      return null;
    }

    return (
      <div className={classes.loginPanel}>
        <div className={classes.list}>
          <div className={classes.colList}>
            <i className="fa fa-user" />
            {username}
          </div>
          <div className={classes.colList}>
            <i className="fa fa-android" />
            {this.renderAgentsDropdown(agents)}
          </div>
          <div className={classes.colList}>
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
  agents: PropTypes.array,
  isAuthorized: PropTypes.bool,
  logout: PropTypes.func,
  onAgentChange: PropTypes.func,
};
