import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends Component {
  handleTotalPrice = () => {
    const { expenses } = this.props;
    if (expenses.length > 0) {
      const total = expenses.reduce((acc, cur) => {
        const exrate = cur.exchangeRates[cur.currency].ask;
        return acc + Number(cur.value) * Number(exrate);
      }, 0);
      return total.toFixed(2);
    }
  };

  render() {
    const { email, expenses } = this.props;
    const totalPrice = this.handleTotalPrice();
    return (
      <>
        <p data-testid="email-field">{`Email: ${email}`}</p>
        <div>
          <p>R$</p>
          <p data-testid="total-field">
            { expenses.length > 0
              ? totalPrice : (0).toFixed(2) }
          </p>
          <p data-testid="header-currency-field">BRL</p>
        </div>
      </>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
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

Header.defaultProps = {
  expenses: PropTypes.shape({
    id: 0,
    value: '',
    description: '',
    method: '',
    tag: '',
    exchangeRates: {},
  }),
};

const mapStateToProps = (globalState) => ({
  email: globalState.user.email,
  expenses: globalState.wallet.expenses,
});

export default connect(mapStateToProps)(Header);
