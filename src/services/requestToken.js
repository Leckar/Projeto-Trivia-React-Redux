const URL = 'https://opentdb.com/api_token.php?command=request';

const requestToken = () => fetch(URL).then((response) => response.json());

export default requestToken;
