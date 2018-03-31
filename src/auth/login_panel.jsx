import React from 'react';
import PropTypes from 'prop-types';

import classes from './login_panel.css';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onTaskModeChange = this.onTaskModeChange.bind(this);
    this.onAgentChange = this.onAgentChange.bind(this);
    this.onScenarioChange = this.onScenarioChange.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
  }

  onLogoutClick(evt) {
    evt.preventDefault();
    this.props.logout();
  }

  onAgentChange(evt) {
    this.props.onAgentChange(evt.target.value);
  }

  onTaskModeChange(evt) {
    this.props.onTaskModeChange(evt.target.value);
  }

  onScenarioChange(evt) {
    this.props.onScenarioChange(+evt.target.value);
  }

  onSearchInputChange(evt) {
    console.log('onSearchInputChange', evt);
    this.props.onScenarioParamChange('searchInput', +evt.target.value);
  }

  renderModeDropdown(modes) {
    const activeMode = modes.find((mode) => mode.active);
    const defaultValue = activeMode.id;

    return (
      <select
        name="modes"
        value={defaultValue}
        onChange={this.onTaskModeChange}
      >
        {modes.map((mode) => {
          return (
            <option value={mode.id}>
              {mode.name}
            </option>
          );
        })}
      </select>
    );
  }

  renderAgentsDropdown(agents, sessionRunning) {
    const activeAgent = agents.find((agent) => agent.active);
    const defaultValue = activeAgent.id;
    const disabled = !!sessionRunning;

    return (
      <select
        name="agents"
        value={defaultValue}
        onChange={this.onAgentChange}
        disabled={disabled}
      >
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

  renderScenarios(scenarios, sessionRunning) {
    const activeScenario = scenarios.find(
      (scenario) => scenario.active, null, { id: '' }
    );

    return (
      <div>
        <i className="fa fa-sitemap" />
        {this.renderScenarioDropdown(scenarios, activeScenario, sessionRunning)}
        {this.renderScenarioControls(activeScenario)}
      </div>
    );
  }

  renderScenarioDropdown(scenarios, activeScenario = {},
    sessionRunning = false) {
    const defaultValue = activeScenario.id;
    const disabled = !!sessionRunning;

    return (
      <select
        name="scenarios"
        value={defaultValue}
        onChange={this.onScenarioChange}
        disabled={disabled}
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

  renderScenarioControl(control) {
    if (control === 'searchInput') {
      return (
        <li><input name="search-input" /></li>
      );
    }

    return null;
  }

  renderScenarioControls(scenario) {
    if (!scenario || !scenario.controls) {
      return null;
    }

    return (
      <ul>
        {scenario.controls.map(this.renderScenarioControl)}
      </ul>
    );
  }

  render() {
    const { isAuthorized, username, modes, agents, scenarios,
      sessionRunning } = this.props;

    if (!isAuthorized) {
      return null;
    }

    return (
      <div className={classes.loginPanel}>
        <div className={classes.row}>
          <div className={classes.rowItem}>
            <i className="fa fa-user" />
            {username}
          </div>
          <div className={classes.rowItem}>
            <a
              className=""
              onClick={this.onLogoutClick}
            >
              <i className="fa fa-fw fa-sign-out" />
              Logout
            </a>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.rowItem}>
            <i className="fa fa-magic" />
            {this.renderModeDropdown(modes)}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.rowItem}>
            <i className="fa fa-android" />
            {this.renderAgentsDropdown(agents, sessionRunning)}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.rowList}>
            {this.renderScenarios(scenarios, sessionRunning)}
          </div>
        </div>
      </div>
    );
  }
}

LoginPanel.propTypes = {
  username: PropTypes.string,
  modes: PropTypes.array,
  agents: PropTypes.array,
  scenarios: PropTypes.array,
  sessionRunning: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  logout: PropTypes.func,
  onModeChange: PropTypes.func,
  onAgentChange: PropTypes.func,
  onScenarioChange: PropTypes.func,
  onScenarioParamChange: PropTypes.func,
  onTaskModeChange: PropTypes.func,
};
