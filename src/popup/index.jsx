import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  startSessionAlias,
  stopSessionAlias,
  createSnapshotAlias,
  logoutAlias,
  activeAgentAlias,
  changeScenarioAlias,
} from '../aliases';
import SessionList from '../sessions/list.jsx';
import LoginPanel from '../auth/login_panel.jsx';
import ControlPanel from './control_panel.jsx';

export class Popup extends React.Component {
  render() {
    const { agents, sessions, sessionId, isAuthorized, isLogging, username,
      sessionRunning, scenarios } = this.props;

    return (
      <div>
        <div id="container">
          <LoginPanel
            isAuthorized={isAuthorized}
            sessionRunning={sessionRunning}
            username={username}
            agents={agents}
            scenarios={scenarios}
            logout={this.props.logoutAlias}
            onAgentChange={this.props.activeAgentAlias}
            onScenarioChange={this.props.changeScenarioAlias}
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

Popup.propTypes = {
  sessionId: PropTypes.number,
  agents: PropTypes.array,
  sessions: PropTypes.array,
  scenarios: PropTypes.array,
  username: PropTypes.string,
  sessionRunning: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  logoutAlias: PropTypes.func,
  startSessionAlias: PropTypes.func,
  stopSessionAlias: PropTypes.func,
  createSnapshotAlias: PropTypes.func,
  activeAgentAlias: PropTypes.func,
  changeScenarioAlias: PropTypes.func,
};

export function mapStateToProps({ agents, sessions, snapshots, auth, ui,
  scenarios }) {
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

  return { agents, sessions: sessionsWithSnapshots, sessionId, isAuthorized,
    username, sessionRunning, scenarios };
}

export default connect(mapStateToProps,
  {
    startSessionAlias,
    stopSessionAlias,
    createSnapshotAlias,
    logoutAlias,
    activeAgentAlias,
    changeScenarioAlias,
  })(Popup);

