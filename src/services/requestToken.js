const URL = 'https://opentdb.com/api_token.php?command=request';

const requestToken = async () => {
  const response = await fetch(URL);
  const data = await response.json();

  return data;
};

export default requestToken;
