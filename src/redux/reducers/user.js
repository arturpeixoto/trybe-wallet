import { SUBMIT_EMAIL } from '../actions/actionCreators';

const INITIAL_STATE = {
  email: '',
};

function user(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SUBMIT_EMAIL:
    return { email: action.payload };
  default:
    return state;
  }
}

export default user;
