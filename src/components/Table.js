import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExpense, editorOn } from '../redux/actions';

class Table extends Component {
  handleConvertion = (expense, type) => {
    if (type === 'currencyName') {
      return expense.exchangeRates[expense.currency].name;
    }
    if (type === 'whichExchange') {
      return Number(expense.exchangeRates[expense.currency].ask).toFixed(2);
    }
    return (Number(expense.exchangeRates[expense.currency].ask)
      * Number(expense.value)).toFixed(2);
  };

  handleDeleteButton(id) {
    const { dispatch } = this.props;
    dispatch(deleteExpense(id));
  }

  handleEditButton(id) {
    const { dispatch } = this.props;
    dispatch(editorOn(true, id));
  }

  render() {
    const { expenses } = this.props;
    return (
      <div className="table-container">
        <h1>Descrição dos gastos</h1>
        <table border="1">
          <thead className="table-head">
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
                <tr key={ expense.id } className="cells">
                  <td>{expense.description}</td>
                  <td className="table-row-even">{expense.tag}</td>
                  <td>{expense.method}</td>
                  <td className="table-row-even">{(Number(expense.value)).toFixed(2)}</td>
                  <td>{this.handleConvertion(expense, 'currencyName')}</td>
                  <td className="table-row-even">
                    {this
                      .handleConvertion(expense, 'whichExchange')}
                  </td>
                  <td>{this.handleConvertion(expense, 'exchangeValue')}</td>
                  <td className="table-row-even">Real</td>
                  <td>
                    <button
                      type="button"
                      data-testid="edit-btn"
                      onClick={ () => this.handleEditButton(expense.id) }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      data-testid="delete-btn"
                      onClick={ () => this.handleDeleteButton(expense.id) }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : ''}
          </tbody>
        </table>
      </div>
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
  editor: globalState.wallet.editor,
  idToEdit: globalState.wallet.idToEdit,
});

export default connect(mapStateToProps)(Table);
