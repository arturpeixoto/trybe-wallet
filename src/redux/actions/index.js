import { SUBMIT_EMAIL, SUBMIT_EXPENSE } from './actionCreators';

const submitEmail = (email) => ({
  type: SUBMIT_EMAIL,
  payload: email,
});

export { submitEmail };
