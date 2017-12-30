import React from 'react';
import { connect } from 'react-redux';

import {
  startSessionAlias,
  stopSessionAlias,
  createSnapshotAlias,
  logoutAlias,
} from '../aliases';
import SessionList from '../sessions/list.jsx';
import LoginPanel from '../auth/login_panel.jsx';
import ControlPanel from './control_panel.jsx';

export class Popup extends React.Component {
  render() {
    const { sessions, sessionId, isAuthorized, username, sessionRunning } =
      this.props;

    return (
      <div>
        <div id="container">
          <LoginPanel
            isAuthorized={isAuthorized}
            username={username}
            logout={this.props.logoutAlias}
          />
          <SessionList items={sessions} />
          <ControlPanel
            sessionId={sessionId}
            startSession={this.props.startSessionAlias}
            stopSession={this.props.stopSessionAlias}
            createSnapshot={this.props.createSnapshotAlias}
            sessionRunning={sessionRunning}
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps({ sessions, snapshots, auth, ui }) { // ownProps
  const isAuthorized = !!auth.isAuthorized;
  const username = auth.username;
  const sessionRunning = ui.sessionRunning;

  const activeSession = sessions.slice(-1)[0];
  const sessionId = (activeSession) ? activeSession.id : '';

  const sessionsWithSnapshots = sessions.map((session) => {
    const sessionSnapshots = snapshots.filter((snapshot) => {
      return snapshot.session === session.id;
    });

    session.snapshots = sessionSnapshots;

    return session;
  });

  return { sessions: sessionsWithSnapshots, sessionId, isAuthorized, username,
    sessionRunning };
}

export default connect(mapStateToProps,
  {
    startSessionAlias,
    stopSessionAlias,
    createSnapshotAlias,
    logoutAlias,
  })(Popup);

