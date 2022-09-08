import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import fetchToken, { setUserAct } from '../redux/actions';

class Login extends Component {
  state = {
    userEmail: '',
    userName: '',
    isFormInvalid: true,
  };

  componentDidUpdate() {
    const { token, history } = this.props;
    if (token) {
      history.push('/game');
    }
  }

  startGame = () => {
    const { dispatch } = this.props;
    const { isFormInvalid, ...userData } = this.state;
    dispatch(fetchToken());
    dispatch(setUserAct(userData));
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, this.validateForm);
  };

  validateEmail = () => {
    const { userEmail } = this.state;
    const regex = /^[\w\x2e]+[\w\x2e]@[\w\x2e]+[\w\x2e]\x2e[a-z]{2,3}(\x2e[a-z]{2})?$/i;

    return regex.test(userEmail);
  };

  validateName = () => {
    const { userName } = this.state;
    const minLength = 3;

    return userName.length >= minLength;
  };

  validateForm = () => {
    const fieldsValidation = [
      this.validateEmail(),
      this.validateName(),
    ];

    const isFormValid = fieldsValidation.every((field) => field);
    this.setState({ isFormInvalid: !isFormValid });
  };

  render() {
    const {
      userName,
      userEmail,
      isFormInvalid,
    } = this.state;

    return (
      <div>
        <form>
          <input
            type="text"
            name="userName"
            data-testid="input-player-name"
            placeholder="Name"
            maxLength="40"
            value={ userName }
            onChange={ this.handleChange }
          />
          <input
            type="text"
            name="userEmail"
            data-testid="input-gravatar-email"
            placeholder="Email"
            maxLength="40"
            value={ userEmail }
            onChange={ this.handleChange }
          />
          <button
            type="button"
            data-testid="btn-play"
            disabled={ isFormInvalid }
            onClick={ this.startGame }
          >
            Play
          </button>
        </form>
        <Link to="/settings">
          <button
            type="button"
            data-testid="btn-settings"
          >
            Configurações
          </button>
        </Link>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = ({ login }) => ({
  token: login.token,
});

export default connect(mapStateToProps)(Login);