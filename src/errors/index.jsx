import React from 'react';
import PropTypes from 'prop-types';

export default class Error extends React.Component {
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
    this.props.login(this.state.username, this.state.password);
  }

  render() {
    const { error, hideError } = this.props;

    return (
      <div className="alert alert-danger">
        {error}
        <div className="form-group">
          <button
            className="btn btn-danger"
            onClick={hideError}
          >
            Hide
          </button>
        </div>
      </div>
    );
  }
}

Error.propTypes = {
  error: PropTypes.string,
  hideError: PropTypes.func,
  login: PropTypes.func,
};
