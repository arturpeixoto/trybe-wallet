import { GET_CURRENCIES, SUBMIT_EMAIL, SUBMIT_EXPENSE } from './actionCreators';

const submitEmail = (email) => ({
  type: SUBMIT_EMAIL,
  payload: email,
});

const listCurrencies = (currency) => ({
  type: GET_CURRENCIES,
  payload: currency,
});

const getCurrencies = () => async (dispatch) => {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  const data = await response.json();
  delete data.USDT;
  const currencies = Object.keys(data);
  dispatch(listCurrencies(currencies));
};

export { submitEmail, getCurrencies };
