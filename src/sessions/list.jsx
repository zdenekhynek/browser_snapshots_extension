import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import classes from './list.css';

export default class SessionList extends React.Component {
  renderSnapshotItem(item) {
    const formattedDate = (item && item.created_at) ?
      moment(item.created_at).format('h:mm:ss a, dddd') : '';
    const formatted = `at ${formattedDate}`;

    return (
      <li className={classes.snapshotItem} key={item.id}>
        <i className="fa fa-camera" aria-hidden="true" />
        {item.title}
        <span className={classes.snapshotTime}>{formatted}</span>
      </li>
    );
  }

  renderSnapshots(items) {
    return (
      <ul className={classes.snapshotsList}>
        {items.map(this.renderSnapshotItem)}
      </ul>
    );
  }

  renderSessionItem(item) {
    const renderedSnapshots = this.renderSnapshots(item.snapshots);

    const formattedStartDate = (item && item.start) ?
      moment(item.start).format('dddd, h:mm:ss a') : '';
    const formattedStart = `From ${formattedStartDate}`;

    const formattedStopDate = (item && item.end) ?
      moment(item.end).format('dddd, h:mm:ss a') : '';
    const formattedStop = (item.end) ? `to ${formattedStopDate}` : '';


    return (
      <li key={item.id} className={classes.sessionItem}>
        <div className={classes.sessionTitle}>
          <i className="fa fa-clock-o" />
          Session #{item.id}
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

SessionList.propTypes = {
  items: PropTypes.array,
};
