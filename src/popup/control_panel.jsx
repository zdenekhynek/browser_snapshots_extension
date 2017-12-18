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
  }

  onStartBtnClick() {
    console.log('onStartBtnClick');
    this.props.startSession(0);
  }

  onStopBtnClick() {
    console.log('onStopBtnClick');
    const { sessionId } = this.props;
    console.log('this.props', this.props);

    this.props.stopSession(sessionId, getDate());
  }

  render() {
    const { sessions } = this.props;

    return (
      <div>
        <button
          id="startBtn"
          onClick={this.onStartBtnClick}
        >
          Start snapshots
        </button>
        <button
          id="stopBtn"
          onClick={this.onStopBtnClick}
        >
          Stop snapshots
        </button>
      </div>
    );
  }
}
