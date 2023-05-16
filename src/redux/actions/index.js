import { GET_CURRENCIES,
  SUBMIT_EMAIL,
  SUBMIT_FORM,
  DELETE_EXPENSE,
  EDIT_EXPENSE,
  EDITOR_ON,
} from './actionCreators';

const APIURL = 'https://economia.awesomeapi.com.br/json/all';

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

const deleteExpense = (id) => ({
  type: DELETE_EXPENSE,
  payload: id,
});

const editorOn = (editor, idToEdit) => ({
  type: EDITOR_ON,
  editor,
  idToEdit,
});

const editExpense = (obj) => ({
  type: EDIT_EXPENSE,
  payload: obj,
});

const getCurrencies = () => async (dispatch) => {
  const response = await fetch(APIURL);
  const data = await response.json();
  delete data.USDT;
  const currencies = Object.keys(data);
  dispatch(listCurrencies(currencies));
};

const getExchangeRates = (expense) => async (dispatch) => {
  const response = await fetch(APIURL);
  const data = await response.json();
  delete data.USDT;
  dispatch(submitForm({
    ...expense,
    exchangeRates: data,
  }));
};

const getExchangeRatesToEdit = (editObj) => async (dispatch) => {
  const response = await fetch(APIURL);
  const data = await response.json();
  delete data.USDT;
  dispatch(editExpense({
    ...editObj,
    exchangeRates: data,
  }));
};

export {
  submitEmail,
  getCurrencies,
  getExchangeRates,
  submitForm,
  deleteExpense,
  editorOn,
  getExchangeRatesToEdit,
};
