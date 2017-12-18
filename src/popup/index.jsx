import React from 'react';
import { connect } from 'react-redux';

import { startSession, stopSession } from '../sessions/action_creators';
import SessionList from '../sessions/list.jsx';
import ControlPanel from './control_panel.jsx';

export class Popup extends React.Component {
  render() {
    const { sessions, sessionId } = this.props;

    return (
      <div>
        <h1>Browser snapshot extension</h1>
        <div id="container">
          <SessionList items={sessions} />
          <ControlPanel
            sessionId={sessionId}
            startSession={this.props.startSession}
            stopSession={this.props.stopSession}
          />
        </div>
      </div>
    )
  }
}

export function mapStateToProps({ sessions }) { // ownProps
  const activeSession = sessions.last();
  const sessionId = (activeSession) ? activeSession.get('id') : '';

  return { sessions, sessionId };
}

export default connect(mapStateToProps,
  {
    startSession,
    stopSession,
  })(Popup);

