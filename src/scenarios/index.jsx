import React from 'react';
import PropTypes from 'prop-types';

export default class Scenarios extends React.Component {
  constructor(props) {
    super(props);

    this.onScenarioChange = this.onScenarioChange.bind(this);
  }

  onScenarioChange(evt) {
    this.props.onScenarioChange(+evt.target.value);
  }

  renderScenarioDropdown(scenarios) {
    const activeScenario = scenarios.find(
      (scenario) => scenario.active, null, { id: '' }
    );
    const defaultValue = activeScenario.id;

    return (
      <label>
        Scenario:
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
      </label>
    );
  }

  render() {
    const { scenarios } = this.props;

    return (
      <div>
        {this.renderScenarioDropdown(scenarios)}
      </div>
    );
  }
}

Scenarios.propTypes = {
  scenarios: PropTypes.array,
  sessionRunning: PropTypes.bool,
  onScenarioChange: PropTypes.func,
};
