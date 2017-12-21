import React from 'react';
import { connect } from 'react-redux';

import Popup from './popup/index.jsx';
import Login from './auth/login.jsx';
import Errors from './errors/index.jsx';
import { hideError } from './errors/action_creators';

import classes from './app.css';

export class App extends React.Component {
  componentDidCatch() {
    console.error('componentDidCatch');
  }

  renderPopup() {
    return (
      <Popup />
    )
  }

  renderLogin() {
    return (
      <Login />
    )
  }

  renderError(errors) {
    return (
      <Errors
        error={errors.get('error')}
        hideError={this.props.hideError}
      />
    );
  }

  render() {
    const { isAuthorized, errors } = this.props;

    const renderedComponent = (isAuthorized) ?
      this.renderPopup() : this.renderLogin();

    const renderedErrors = (errors.get('displayedError')) ?
      this.renderError(errors) : null;

    return (
      <div className={classes.app}>
        {renderedComponent}
        {renderedErrors}
      </div>
    );
  }
}

export function mapStateToProps({ auth, errors }) { // ownProps
  const isAuthorized = auth.get('isAuthorized', false);
  return { isAuthorized, errors };
}

export default connect(mapStateToProps, { hideError })(App);
