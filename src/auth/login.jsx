import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginAlias } from '../aliases';

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
      [name]: value,
    });
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.props.loginAlias(this.state.username, this.state.password);
  }

  render() {
    const { isLogging } = this.props;

    const disabled = isLogging;

    return (
      <div className="card card-login">
        <div className="card-body">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                name="username"
                placeholder="username"
                type="input"
                value={this.state.username}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="password"
                placeholder="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={disabled}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  isLogging: PropTypes.bool,
  loginAlias: PropTypes.func,
};


export function mapStateToProps({ auth }) {
  const isLogging = !!auth.isLogging;

  return { isLogging };
}

export default connect(mapStateToProps, { loginAlias })(Login);
