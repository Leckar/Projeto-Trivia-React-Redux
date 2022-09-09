import {
  SET_USER_DATA,
} from '../actions';

const INITIAL_STATE = {
  name: '',
  gravatarEmail: '',
  score: 0,
  assertions: 0,
};

const player = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case SET_USER_DATA:
    return {
      ...state,
      name: payload.userName,
      gravatarEmail: payload.userEmail,
      score: 0,
      assertions: 0,
    };
  default: return state;
  }
};

export default player;
