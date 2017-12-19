import React from 'react';
import { List } from 'immutable';

export default class SessionList extends React.Component {
  renderSnapshotItem(item) {
    return (
      <li key={item.get('id')}>
        Snapshot: {item.get('title')}
      </li>
    )
  }

  renderSnapshots(items) {
    return (
      <ul>
        {items.map(this.renderSnapshotItem)}
      </ul>
    )
  }

  renderSessionItem(item) {
    const renderedSnapshots = this.renderSnapshots(item.get('snapshots'));

    return (
      <li key={item.get('id')}>
        Session: {item.get('start')}, {item.get('end')}
        {renderedSnapshots}
      </li>
    );
  }

  render() {
    const { items } = this.props;

    return (
      <ul>
        {items.map(this.renderSessionItem.bind(this))}
      </ul>
    );
  }
}
