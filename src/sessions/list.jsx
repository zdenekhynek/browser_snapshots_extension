import React from 'react';
import { List } from 'immutable';
import moment from 'moment';

import classes from './list.css';

export default class SessionList extends React.Component {
  renderSnapshotItem(item) {
    return (
      <li className={classes.snapshotItem} key={item.get('id')}>
        <i className="fa fa-camera" aria-hidden="true"></i>
        {item.get('title')}
      </li>
    )
  }

  renderSnapshots(items) {
    return (
      <ul className={classes.snapshotsList}>
        {items.map(this.renderSnapshotItem)}
      </ul>
    )
  }

  renderSessionItem(item) {
    const renderedSnapshots = this.renderSnapshots(item.get('snapshots'));

    const formattedStartDate = moment(item.get('start')).format('dddd, h:mm:ss a');
    const formattedStart = `From ${formattedStartDate}`;

    const formattedStopDate = moment(item.get('end')).format('dddd, h:mm:ss a');
    const formattedStop = (item.get('end')) ? `to ${formattedStopDate}` : '';


    return (
      <li key={item.get('id')} className={classes.sessionItem}>
        <div className={classes.sessionTitle}>
          <i className="fa fa-clock-o"></i>
          Session #{item.get('id')}
        </div>
        <div className={classes.sessionTimings}>
          {formattedStart} {formattedStop}
        </div>
        <div>
        {renderedSnapshots}
        </div>
      </li>
    );
  }

  render() {
    const { items } = this.props;

    return (
      <ul className={classes.list}>
        {items.map(this.renderSessionItem.bind(this))}
      </ul>
    );
  }
}
