import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { submitEmail } from '../redux/actions';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleClick = () => {
    const { history, dispatch } = this.props;
    const { email } = this.state;
    dispatch(submitEmail(email));
    history.push('/carteira');
  };

  validationFields = () => {
    const { email, password } = this.state;
    const MIN_PASSWORD_LENGTH = 6;
    const valPass = password.length >= MIN_PASSWORD_LENGTH;
    const valAt = email.includes('@');
    const valDotCom = email.includes('.com');
    return !(valPass && valAt && valDotCom);
  };

  render() {
    const { email, password } = this.state;
    const validation = this.validationFields();
    return (
      <div className="login-form">
        <h1>Wallet! Sua carteira digital!</h1>
        <label className="input-email-label" htmlFor="email-input">
          Email
          <input
            type="email"
            value={ email }
            name="email"
            id="email-input"
            onChange={ this.handleChange }
            data-testid="email-input"
            required
          />
        </label>
        <br />
        <label className="input-password-label" htmlFor="password-input">
          Senha
          <input
            type="password"
            name="password"
            value={ password }
            id="password-input"
            onChange={ this.handleChange }
            data-testid="password-input"
            required
          />
        </label>
        <button
          type="button"
          disabled={ validation }
          onClick={ this.handleClick }
        >
          Entrar
        </button>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
