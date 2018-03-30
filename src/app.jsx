import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Popup from './popup/index.jsx';
import Login from './auth/login.jsx';
import Errors from './errors/index.jsx';
import { hideError } from './errors/action_creators';
import { fetchAgentsAlias } from './aliases';
import { navigateToUrl, clearCache, executeScript }
  from './utils/extension_utils';
import { searchYoutube, clickSearchResult } from './scenarios/scenario_scripts';

import classes from './app.css';

export class App extends React.Component {
  componentDidMount() {
    if (this.props.isAuthorized) {
      this.fetchAgents();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthorized && nextProps.isAuthorized) {
      this.fetchAgents();
    }
  }

  componentDidCatch() {
    console.error('componentDidCatch'); // eslint-disable-line no-console
  }

  fetchAgents() {
    this.props.fetchAgentsAlias();
  }

  renderPopup() {
    return (
      <Popup />
    );
  }

  renderLogin() {
    return (
      <Login />
    );
  }

  renderError(errors) {
    return (
      <Errors
        error={errors.error}
        hideError={this.props.hideError}
      />
    );
  }

  render() {
    const { isAuthorized, errors } = this.props;

    const renderedComponent = (isAuthorized) ?
      this.renderPopup() : this.renderLogin();

    const renderedErrors = (errors.displayedError) ?
      this.renderError(errors) : null;

    return (
      <div className={classes.app}>
        <button onClick={() => clearCache()}>Clear cache</button>
        <button onClick={() => navigateToUrl('http://youtube.com')}>
          Navigate to YT
        </button>
        <button onClick={() => executeScript(searchYoutube('honesty'))}>
          Search
        </button>
        <button onClick={() => executeScript(clickSearchResult(0))}>
          Click search
        </button>
        {renderedComponent}
        {renderedErrors}
      </div>
    );
  }
}

App.propTypes = {
  isAuthorized: PropTypes.bool,
  errors: PropTypes.object,
  hideError: PropTypes.func,
  fetchAgentsAlias: PropTypes.func,
};

export function mapStateToProps({ auth, agents, errors }) { // ownProps
  const isAuthorized = !!auth.isAuthorized;
  console.log('errors', errors);
  return { isAuthorized, errors, agents };
}

export default connect(mapStateToProps,
  { hideError, fetchAgentsAlias }
)(App);
