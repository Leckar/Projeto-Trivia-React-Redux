/* import {
  SET_USER_RANKING,
} from '../actions';

const INITIAL_STATE = [];

const player = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case SET_USER_RANKING:
    return [
      ...state,
      {
        name: payload.name,
        score: payload.score,
        picture: payload.picture,
      },
    ];
  default: return state;
  }
};

export default player;
 */
