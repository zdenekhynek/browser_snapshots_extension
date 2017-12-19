import React from 'react';
import { connect } from 'react-redux';

import { startSession, stopSession } from '../sessions/action_creators';
import { createSnapshot } from '../snapshots/action_creators';
import { logout } from '../auth/action_creators';
import SessionList from '../sessions/list.jsx';
import LoginPanel from '../auth/login_panel.jsx';
import ControlPanel from './control_panel.jsx';

export class Popup extends React.Component {
  render() {
    const { sessions, sessionId, isAuthorized, username } = this.props;
    console.log('Popup render', sessionId);

    return (
      <div>
        <div id="container">
          <LoginPanel
            isAuthorized={isAuthorized}
            username={username}
            logout={this.props.logout}
          />
          <SessionList items={sessions} />
          <ControlPanel
            sessionId={sessionId}
            startSession={this.props.startSession}
            stopSession={this.props.stopSession}
            createSnapshot={this.props.createSnapshot}
          />
        </div>
      </div>
    )
  }
}

export function mapStateToProps({ sessions, snapshots, auth }) { // ownProps
  const isAuthorized = auth.get('isAuthorized');
  const username = auth.get('username');

  const activeSession = sessions.last();
  const sessionId = (activeSession) ? activeSession.get('id') : '';

  const sessionsWithSnapshots = sessions.map((session) => {
    const sessionSnapshots = snapshots.filter((snapshot) => {
      return snapshot.get('session') === session.get('id');
    });
    return session.set('snapshots', sessionSnapshots);
  });

  console.log('activeSession', activeSession, sessionId);

  return { sessions: sessionsWithSnapshots, sessionId, isAuthorized, username };
}

export default connect(mapStateToProps,
  {
    startSession,
    stopSession,
    createSnapshot,
    logout,
  })(Popup);

