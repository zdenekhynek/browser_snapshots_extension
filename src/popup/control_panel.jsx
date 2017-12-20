import React from 'react';
import { connect } from 'react-redux';

import { startSession, stopSession } from '../sessions/action_creators';
import { createSnapshot } from '../snapshots/action_creators';
import SessionList from '../sessions/list.jsx';
import getDate from '../utils/get_date';
import { getSnapshot } from '../utils/extension_utils.js';

import classes from './control_panel.css';

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
      <div className={classes.controlPanel}>
        <button
          id="startBtn"
          className={`btn btn-primary btn-sm ${classes.startBtn}`}
          disabled={startBtnDisabled}
          onClick={this.onStartBtnClick}
        >
          <i className="fa fa-play" aria-hidden="true"></i>
          Start snapshots
        </button>
        <button
          id="stopBtn"
          className={`btn btn-primary btn-sm ${classes.stopBtn}`}
          disabled={stopBtnDisabled}
          onClick={this.onStopBtnClick}
        >
          <i className="fa fa-pause" aria-hidden="true"></i>
          Stop snapshots
        </button>
      </div>
    );
  }
}
