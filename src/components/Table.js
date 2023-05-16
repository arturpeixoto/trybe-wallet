import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExpense } from '../redux/actions';

class Table extends Component {
  handleConvertion = (expense, type) => {
    switch (type) {
    case 'currencyName':
      return expense.exchangeRates[expense.currency].name;
    case 'whichExchange':
      return Number(expense.exchangeRates[expense.currency].ask).toFixed(2);
    case 'exchangeValue':
      return (Number(expense.exchangeRates[expense.currency].ask)
       * Number(expense.value)).toFixed(2);
    default:
      return expense;
    }
  };

  handleDeleteButton(expense) {
    const { expenses, dispatch } = this.props;
    const newExpenses = expenses.filter((exp) => exp !== expense);
    dispatch(deleteExpense(newExpenses));
  }

  render() {
    const { expenses } = this.props;
    return (
      <>
        <h1>Descrição dos gastos</h1>
        <table border="1">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {expenses ? (
              expenses.map((expense) => (
                <tr key={ expense.id }>
                  <td>{expense.description}</td>
                  <td>{expense.tag}</td>
                  <td>{expense.method}</td>
                  <td>{(Number(expense.value)).toFixed(2)}</td>
                  <td>{this.handleConvertion(expense, 'currencyName')}</td>
                  <td>{this.handleConvertion(expense, 'whichExchange')}</td>
                  <td>{this.handleConvertion(expense, 'exchangeValue')}</td>
                  <td>Real</td>
                  <td>
                    <button
                      type="button"
                      data-testid="edit-btn"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      data-testid="delete-btn"
                      onClick={ () => this.handleDeleteButton(expense) }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : ''}
          </tbody>
        </table>
      </>
    );
  }
}

Table.propTypes = {
  dispatch: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
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

Table.defaultProps = {
  expenses: [],
};

const mapStateToProps = (globalState) => ({
  expenses: globalState.wallet.expenses,
});

export default connect(mapStateToProps)(Table);
