const minTriviaQuestions = 5;
const BASE_URL = 'https://opentdb.com';
const ENDPOINT = '/api.php';

const requestTrivia = async (token) => {
  const ENDPOINT_PARAMS = `?amount=${minTriviaQuestions}&token=${token}`;
  const URL = `${BASE_URL}${ENDPOINT}${ENDPOINT_PARAMS}`;
  const response = await fetch(URL);
  const data = await response.json();

  return data;
};

export default requestTrivia;
