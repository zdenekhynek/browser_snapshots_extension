import React from 'react';
import { connect } from 'react-redux';

import { startSession, stopSession } from '../sessions/action_creators';
import SessionList from '../sessions/list.jsx';
import getDate from '../utils/get_date';

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onStartBtnClick = this.onStartBtnClick.bind(this);
    this.onStopBtnClick = this.onStopBtnClick.bind(this);

    this.state = { sessionRunning: false };
  }

  onStartBtnClick() {
    this.props.startSession(0);
    this.setState({ sessionRunning: true });
  }

  onStopBtnClick() {
    const { sessionId } = this.props;
    this.props.stopSession(sessionId, getDate());
    this.setState({ sessionRunning: false });
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
