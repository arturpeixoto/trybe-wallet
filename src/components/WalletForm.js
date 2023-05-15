import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrencies } from '../redux/actions';

class WalletForm extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    console.log(dispatch);
    dispatch(getCurrencies());
  }

  render() {
    const { currencies } = this.props;
    console.log(currencies);
    return (
      <>
        <label htmlFor="value-input">
          Valor
          <input
            type="number"
            data-testid="value-input"
            id="value-input"
          />
        </label>
        {currencies ? (
          <label htmlFor="currency-input">
            Moeda
            <select
              name="currency-input"
              id="currency-input"
              data-testid="currency-input"
            >
              {currencies.map((cur, index) => (
                <option key={ index } value={ cur }>{cur}</option>
              ))}
            </select>
          </label>
        ) : ''}
        <label htmlFor="description-input">
          Descrição
          <input
            type="text"
            id="description-input"
            data-testid="description-input"
          />
        </label>
        <label htmlFor="method">
          Método de pagamento
          <select
            name="method"
            id="method"
            data-testid="method-input"
          >
            <option value="cash">Dinheiro</option>
            <option value="credit-card">Cartão de crédito</option>
            <option value="debit-card">Cartão de débito</option>
          </select>
        </label>
        <label htmlFor="tag">
          Categoria
          <select
            name="tag"
            id="tag"
            data-testid="tag-input"
          >
            <option value="food">Alimentação</option>
            <option value="leisure">Lazer</option>
            <option value="work">Trabalho</option>
            <option value="transportation">Transporte</option>
            <option value="health">Saúde</option>
          </select>
        </label>
        <button type="button">Adicionar</button>
      </>
    );
  }
}

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string),
};

WalletForm.defaultProps = {
  currencies: [],
};

const mapStateToProps = (globalState) => ({
  currencies: globalState.wallet.currencies,
});

export default connect(mapStateToProps)(WalletForm);
