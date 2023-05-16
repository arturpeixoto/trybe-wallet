import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getExchangeRatesToEdit,
  editorOn,
  getCurrencies,
  getExchangeRates,
} from '../redux/actions';

const ALIMENTACAO = 'Alimentação';

class WalletForm extends Component {
  state = {
    value: '',
    currency: 'USD',
    description: '',
    method: 'Dinheiro',
    tag: ALIMENTACAO,
    id: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getCurrencies());
  }

  componentDidUpdate(prevProps) {
    const { editor } = this.props;
    if (editor !== prevProps.editor) {
      this.handleInfoOnInput();
    }
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleClick = () => {
    const { dispatch } = this.props;
    let { id } = this.state;
    const objState = this.state;
    dispatch(getExchangeRates(objState));
    id += 1;
    this.setState({
      value: '',
      currency: 'USD',
      description: '',
      method: 'Dinheiro',
      tag: ALIMENTACAO,
      id,
    });
  };

  handleInfoOnInput = () => {
    const { expenses, idToEdit, editor } = this.props;
    const showExpense = expenses.find((exp) => exp.id === idToEdit);
    console.log(showExpense);
    if (editor) {
      this.setState({
        value: showExpense.value,
        currency: showExpense.currency,
        description: showExpense.description,
        method: showExpense.method,
        tag: showExpense.tag,
        id: showExpense.id,
      });
    }
  };

  handleClickChange = () => {
    const { dispatch, idToEdit, expenses } = this.props;
    const editObj = this.state;
    dispatch(getExchangeRatesToEdit(editObj));
    dispatch(editorOn(false, idToEdit));
    this.setState({
      value: '',
      currency: 'USD',
      description: '',
      method: 'Dinheiro',
      tag: ALIMENTACAO,
      id: expenses[expenses.length - 1].id + 1,
    });
  };

  render() {
    const { currencies, editor } = this.props;
    const { value, currency, description, method, tag } = this.state;
    return (
      <>
        <label htmlFor="value-input">
          Valor
          <input
            type="number"
            data-testid="value-input"
            id="value-input"
            name="value"
            value={ value }
            onChange={ this.handleChange }
          />
        </label>
        {currencies ? (
          <label htmlFor="currency-input">
            Moeda
            <select
              id="currency-input"
              data-testid="currency-input"
              name="currency"
              value={ currency }
              onChange={ this.handleChange }
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
            name="description"
            value={ description }
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="method">
          Método de pagamento
          <select
            name="method"
            id="method"
            data-testid="method-input"
            value={ method }
            onChange={ this.handleChange }
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de crédito">Cartão de crédito</option>
            <option value="Cartão de débito">Cartão de débito</option>
          </select>
        </label>
        <label htmlFor="tag">
          Categoria
          <select
            name="tag"
            id="tag"
            data-testid="tag-input"
            value={ tag }
            onChange={ this.handleChange }
          >
            <option value="Alimentação">Alimentação</option>
            <option value="Lazer">Lazer</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Transporte">Transporte</option>
            <option value="Saúde">Saúde</option>
          </select>
        </label>
        {!editor ? (
          <button
            type="button"
            onClick={ this.handleClick }
          >
            Adicionar despesa
          </button>
        ) : (
          <button
            type="button"
            onClick={ this.handleClickChange }
          >
            Editar despesa
          </button>
        )}
      </>
    );
  }
}

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string),
  editor: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    exchangeRates: PropTypes.shape({
      ask: PropTypes.string,
      bid: PropTypes.string,
      code: PropTypes.string,
      codein: PropTypes.string,
      create_date: PropTypes.string,
      high: PropTypes.string,
      low: PropTypes.string,
      name: PropTypes.string,
      pctChange: PropTypes.string,
      timestamp: PropTypes.string,
      varBid: PropTypes.string,
    }).isRequired,
  }).isRequired),
};

WalletForm.defaultProps = {
  currencies: [],
  expenses: [],
};

const mapStateToProps = (globalState) => ({
  currencies: globalState.wallet.currencies,
  exchangeRates: globalState.wallet.expenses.exchangeRates,
  editor: globalState.wallet.editor,
  idToEdit: globalState.wallet.idToEdit,
  expenses: globalState.wallet.expenses,
});

export default connect(mapStateToProps)(WalletForm);
