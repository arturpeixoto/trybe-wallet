import { GET_CURRENCIES,
  SUBMIT_EMAIL,
  SUBMIT_FORM,
  DELETE_EXPENSE,
} from './actionCreators';

const submitEmail = (email) => ({
  type: SUBMIT_EMAIL,
  payload: email,
});

const listCurrencies = (currency) => ({
  type: GET_CURRENCIES,
  payload: currency,
});

const submitForm = (state) => ({
  type: SUBMIT_FORM,
  payload: state,
});

const deleteExpense = (expenses) => ({
  type: DELETE_EXPENSE,
  payload: expenses,
});

const getCurrencies = () => async (dispatch) => {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  const data = await response.json();
  delete data.USDT;
  const currencies = Object.keys(data);
  dispatch(listCurrencies(currencies));
};

const getExchangeRates = (expense) => async (dispatch) => {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  const data = await response.json();
  delete data.USDT;
  dispatch(submitForm({
    ...expense,
    exchangeRates: data,
  }));
};

export {
  submitEmail,
  getCurrencies,
  getExchangeRates,
  submitForm,
  deleteExpense,
};
