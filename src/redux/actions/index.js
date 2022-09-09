import requestToken from '../../services/requestToken';

const REQUEST_API = 'REQUEST_API';
const RECEIVE_TOKEN_SUCCESS = 'RECEIVE_TOKEN_SUCCESS';
const RECEIVE_TRIVIA_SUCCESS = 'RECEIVE_TRIVIA_SUCCESS';
const RECEIVE_FAILURE = 'RECEIVE_FAILURE';
const SET_USER_DATA = 'SET_USER_DATA';

// salvar login do usuário
const setUserAct = (userData) => ({
  type: SET_USER_DATA,
  payload: userData,
});

// pedir token
const requestingApiAct = () => ({
  type: REQUEST_API,
});

// token sucesso
const receiveTokenSuccess = (token) => ({
  type: RECEIVE_TOKEN_SUCCESS,
  payload: token,
});

// falha
const receiveFailure = (error) => ({
  type: RECEIVE_FAILURE,
  payload: error,
});

// fetch token
const fetchToken = async (dispatch) => {
  dispatch(requestingApiAct());
  return requestToken()
    .then(({ token }) => {
      dispatch(receiveTokenSuccess(token));
      localStorage.setItem('token', token);
    })
    .catch((error) => dispatch(receiveFailure(error)));
};

export {
  REQUEST_API,
  RECEIVE_TOKEN_SUCCESS,
  RECEIVE_FAILURE,
  SET_USER_DATA,
  RECEIVE_TRIVIA_SUCCESS,
  setUserAct,
  fetchToken,
};
