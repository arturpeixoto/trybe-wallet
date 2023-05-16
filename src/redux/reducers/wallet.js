import {
  DELETE_EXPENSE,
  EDITOR_ON,
  EDIT_EXPENSE,
  GET_CURRENCIES,
  SUBMIT_FORM,
} from '../actions/actionCreators';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
};

function wallet(state = INITIAL_STATE, action) {
  switch (action.type) {
  case GET_CURRENCIES:
    return {
      ...state,
      currencies: action.payload,
    };
  case SUBMIT_FORM:
    return {
      ...state,
      expenses: [
        ...state.expenses,
        action.payload,
      ],
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter(({ id }) => id !== action.payload),
    };
  case EDITOR_ON:
    return {
      ...state,
      editor: action.editor,
      idToEdit: action.idToEdit,
    };
  case EDIT_EXPENSE:
    return {
      ...state,
      expenses: state.expenses
        .map((expense) => {
          if (expense.id === action.payload.id) {
            return action.payload;
          }
          return expense;
        }),
    };
  default:
    return state;
  }
}

export default wallet;
