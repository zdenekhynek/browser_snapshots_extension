import React from 'react';

import getDate from '../utils/get_date';

import classes from './control_panel.css';

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onStartBtnClick = this.onStartBtnClick.bind(this);
    this.onStopBtnClick = this.onStopBtnClick.bind(this);
  }

  onStartBtnClick() {
    this.props.startSession(0);
  }

  onStopBtnClick() {
    const { sessionId } = this.props;
    this.props.stopSession(sessionId, getDate());
  }

  render() {
    const { sessions, sessionRunning } = this.props;

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
          <i className="fa fa-play" aria-hidden="true" />
          Start snapshots
        </button>
        <button
          id="stopBtn"
          className={`btn btn-primary btn-sm ${classes.stopBtn}`}
          disabled={stopBtnDisabled}
          onClick={this.onStopBtnClick}
        >
          <i className="fa fa-pause" aria-hidden="true" />
          Stop snapshots
        </button>
      </div>
    );
  }
}
