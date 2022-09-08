import {
  REQUEST_API_TOKEN,
  RECEIVE_TOKEN_SUCCESS,
  RECEIVE_TOKEN_FAILURE,
  SET_USER_DATA,
} from '../actions';

const INITIAL_STATE = {
  requesting: false,
  token: '',
};

const login = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case REQUEST_API_TOKEN:
    return {
      ...state,
      requesting: true,
    };
  case RECEIVE_TOKEN_SUCCESS:
    return {
      ...state,
      requesting: false,
      token: payload,
    };
  case RECEIVE_TOKEN_FAILURE:
    return {
      ...state,
      requesting: false,
      error: payload,
    };
  case SET_USER_DATA:
    return {
      ...state,
      player: {
        name: payload.userName,
        gravatarEmail: payload.userEmail,
        score: 0,
        assertions: 0,
      },
    };
  default: return state;
  }
};

export default login;
