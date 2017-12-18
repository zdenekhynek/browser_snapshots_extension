import React from 'react';

export default class Popup extends React.Component {
  render() {
    return (
      <div>
        <h1>Browser snapshot extension</h1>
        <div id="container">
          <button id="saveBtn">Save snapshot</button>
          <button id="startBtn">Start snapshots</button>
          <button id="stopBtn" disabled>Stop snapshots</button>
        </div>
      </div>
    )
  }
}
