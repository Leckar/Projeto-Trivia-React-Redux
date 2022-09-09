import requestToken from '../../services/requestAPI';

const REQUEST_API_TOKEN = 'REQUEST_API_TOKEN';
const RECEIVE_TOKEN_SUCCESS = 'RECEIVE_TOKEN_SUCCESS';
const RECEIVE_TOKEN_FAILURE = 'RECEIVE_TOKEN_FAILURE';
const SET_USER_DATA = 'SET_USER_DATA';

// salvar login do usuário
const setUserAct = (userData) => ({
  type: SET_USER_DATA,
  payload: userData,
});

// pedir token
const requestTokenAct = () => ({
  type: REQUEST_API_TOKEN,
});

// token sucesso
const receiveTokenSuccess = (token) => ({
  type: RECEIVE_TOKEN_SUCCESS,
  payload: token,
});

// token falha
const receiveTokenFailure = (error) => ({
  type: RECEIVE_TOKEN_FAILURE,
  payload: error,
});

// fetch token
const fetchToken = async (dispatch) => {
  dispatch(requestTokenAct());
  return requestToken()
    .then(({ token }) => {
      dispatch(receiveTokenSuccess(token));
      localStorage.setItem('token', token);
    })
    .catch((error) => dispatch(receiveTokenFailure(error)));
};

export default fetchToken;

export {
  REQUEST_API_TOKEN,
  RECEIVE_TOKEN_SUCCESS,
  RECEIVE_TOKEN_FAILURE,
  SET_USER_DATA,
  setUserAct,
};
