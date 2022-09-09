import requestToken from '../../services/requestToken';
import requestTrivia from '../../services/requestTrivia';

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

// perguntas sucesso
const receiveTriviaSuccess = (questionsObj) => ({
  type: RECEIVE_TRIVIA_SUCCESS,
  payload: questionsObj,
});

// falha
const receiveFailure = (error) => ({
  type: RECEIVE_FAILURE,
  payload: error,
});

// fetch token
const fetchToken = async (dispatch) => {
  dispatch(requestingApiAct());

  try {
    const { response_code: responseCode, token } = await requestToken();
    console.log(token);
    if (responseCode !== 0) throw new Error('Token Invalid');

    dispatch(receiveTokenSuccess(token));
    localStorage.setItem('token', token);
  } catch (error) {
    dispatch(receiveFailure(error.message));
    localStorage.removeItem('token');
  }
};

// fetch trivia questions
const fetchTrivia = (token) => async (dispatch) => {
  dispatch(requestingApiAct());
  try {
    const { response_code: responseCode, results } = await requestTrivia(token);
    if (responseCode !== 0) throw new Error('Token Invalid');

    dispatch(receiveTriviaSuccess(results));
  } catch (error) {
    dispatch(receiveFailure(error.message));
    localStorage.removeItem('token');
  }
};

export {
  REQUEST_API,
  RECEIVE_TOKEN_SUCCESS,
  RECEIVE_FAILURE,
  SET_USER_DATA,
  RECEIVE_TRIVIA_SUCCESS,
  setUserAct,
  fetchToken,
  fetchTrivia,
};
