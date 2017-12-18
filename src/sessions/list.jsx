import React from 'react';
import { List } from 'immutable';

export default class SessionList extends React.Component {
  renderItem(item) {
    console.log('item', item);
    return (
      <li key={item.get('id')}>
        Session: {item.get('start')}, {item.get('end')}
      </li>
    );
  }

  render() {
    const { items } = this.props;

    console.log('items', items.toJS());

    return (
      <ul>
        {items.map(this.renderItem)}
      </ul>
    );
  }
}
