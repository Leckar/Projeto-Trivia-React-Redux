import {
  REQUEST_API,
  RECEIVE_TOKEN_SUCCESS,
  RECEIVE_FAILURE,
  RECEIVE_TRIVIA_SUCCESS,
} from '../actions';

const INITIAL_STATE = {
  requesting: false,
  token: '',
  error: '',
  triviaQuestions: [],
};

const apiReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case REQUEST_API:
    return {
      ...state,
      requesting: true,
    };
  case RECEIVE_TOKEN_SUCCESS:
    return {
      ...state,
      requesting: false,
      error: '',
      token: payload,
    };
  case RECEIVE_TRIVIA_SUCCESS:
    return {
      ...state,
      requesting: false,
      error: '',
      triviaQuestions: payload,
    };
  case RECEIVE_FAILURE:
    return {
      ...state,
      requesting: false,
      error: payload,
    };
  default: return state;
  }
};

export default apiReducer;
