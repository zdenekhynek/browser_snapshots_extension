import React from 'react';
import { connect } from 'react-redux';

import { login } from './action_creators';

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { username: '', password: '' };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(evt) {
    const target = evt.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.props.login(this.state.username, this.state.password);
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.onSubmit}>
          <input
            name="username"
            type="input"
            value={this.state.username}
            onChange={this.onChange}
          />
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.onChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, { login })(Login);
