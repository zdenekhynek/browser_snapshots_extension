import React from 'react';
import { connect } from 'react-redux';

import { startSession, stopSession } from '../sessions/action_creators';
import { createSnapshot } from '../snapshots/action_creators';
import SessionList from '../sessions/list.jsx';
import getDate from '../utils/get_date';
import { getSnapshot } from '../utils/extension_utils.js';

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onStartBtnClick = this.onStartBtnClick.bind(this);
    this.onStopBtnClick = this.onStopBtnClick.bind(this);

    this.state = { sessionRunning: false };
    this.pendingSession = false;
    this.snapshotInterval;

  }

  componentDidUpdate() {
    if (this.pendingSession && this.props.sessionId) {
      this.startInterval();
      this.pendingSession = false;
    }
  }

  startInterval(interval = 10000) {
    this.snapshotInterval = setInterval(() => {
      this.makeSnapshot();
    }, interval);

    this.makeSnapshot();
  }

  stopInterval() {
    clearInterval(this.snapshotInterval);
  }

  makeSnapshot() {
    const { sessionId } = this.props;

    getSnapshot().then(({ title, url, sourceCode, image }) => {
      this.props.createSnapshot(sessionId, 0, title, url, sourceCode, image);
    });
  }

  onStartBtnClick() {
    this.props.startSession(0);
    this.setState({ sessionRunning: true });
    this.pendingSession = true;
  }

  onStopBtnClick() {
    const { sessionId } = this.props;
    this.props.stopSession(sessionId, getDate());
    this.setState({ sessionRunning: false });
    this.stopInterval();
  }

  render() {
    const { sessions } = this.props;
    const { sessionRunning } = this.state;

    const startBtnDisabled = sessionRunning;
    const stopBtnDisabled = !sessionRunning;

    return (
      <div>
        <button
          id="startBtn"
          disabled={startBtnDisabled}
          onClick={this.onStartBtnClick}
        >
          Start snapshots
        </button>
        <button
          id="stopBtn"
          disabled={stopBtnDisabled}
          onClick={this.onStopBtnClick}
        >
          Stop snapshots
        </button>
      </div>
    );
  }
}
