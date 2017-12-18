import React from 'react';
import { connect } from 'react-redux';

import Popup from './popup/index.jsx';
import Login from './auth/login.jsx';

export class App extends React.Component {
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

  render() {
    const { isAuthorized } = this.props;

    const renderedComponent = (isAuthorized) ?
      this.renderPopup() : this.renderLogin();

    return (
      <div>
        {renderedComponent}
      </div>
    );
  }
}

export function mapStateToProps({ auth }) { // ownProps
  const isAuthorized = auth.get('isAuthorized', false);

  return { isAuthorized };
}

export default connect(mapStateToProps)(App);
