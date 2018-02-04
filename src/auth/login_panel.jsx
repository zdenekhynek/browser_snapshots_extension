import React from 'react';
import PropTypes from 'prop-types';

import classes from './login_panel.css';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onAgentChange = this.onAgentChange.bind(this);
    this.onScenarioChange = this.onScenarioChange.bind(this);
  }

  onLogoutClick(evt) {
    evt.preventDefault();
    this.props.logout();
  }

  onAgentChange(evt) {
    this.props.onAgentChange(evt.target.value);
  }

  onScenarioChange(evt) {
    this.props.onScenarioChange(+evt.target.value);
  }

  renderAgentsDropdown(agents) {
    const activeAgent = agents.find((agent) => agent.active);
    const defaultValue = activeAgent.id;

    return (
      <select name="agents" value={defaultValue} onChange={this.onAgentChange}>
        {agents.map((agent) => {
          return (
            <option value={agent.id}>
              {agent.name}
            </option>
          );
        })}
      </select>
    );
  }

  renderScenarioDropdown(scenarios) {
    const activeScenario = scenarios.find(
      (scenario) => scenario.active, null, { id: '' }
    );
    const defaultValue = activeScenario.id;

    return (
      <select
        name="scenarios"
        value={defaultValue}
        onChange={this.onScenarioChange}
      >
        {scenarios.map((scenario) => {
          return (
            <option value={scenario.id}>
              {scenario.name}
            </option>
          );
        })}
      </select>
    );
  }

  render() {
    const { isAuthorized, username, agents, scenarios } = this.props;

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
            <i className="fa fa-sitemap" />
            {this.renderScenarioDropdown(scenarios)}
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
  scenarios: PropTypes.array,
  sessionRunning: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  logout: PropTypes.func,
  onAgentChange: PropTypes.func,
  onScenarioChange: PropTypes.func,
};
