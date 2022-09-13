import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import GameButtons from '../components/GameButtons';
import GameQuestion from '../components/GameQuestion';
import { fetchTrivia, sumScoreAct } from '../redux/actions';
import { saveInStorage, readStorage, RANKING, TOKEN } from '../services/localStorage';
import getGravatarImage from '../services/getGravatarImage';

const DIFFICULTY_SCORE = {
  easy: 1,
  medium: 2,
  hard: 3,
};

class Game extends Component {
  state = {
    timer: 30,
    isDisabled: false,
    questionIndex: 0,
    timerID: 0,
  };

  componentDidMount() {
    const {
      token,
      dispatchTriviaQuestions,
    } = this.props;

    dispatchTriviaQuestions(token);
    this.timer();
  }

  componentDidUpdate(_, { questionIndex: prevQuestionIndex }) {
    const { error, history } = this.props;
    const { questionIndex, isDisabled, timerID } = this.state;

    if (isDisabled) clearInterval(timerID);
    if (prevQuestionIndex !== questionIndex) this.timer();
    if (error) history.push('/');
  }

  disableQuestion = () => this.setState({ isDisabled: true });

  saveUserRank = () => {
    const { player: { name, score, gravatarEmail: userEmail } } = this.props;
    const pictureHash = getGravatarImage(userEmail);
    const newUserRank = {
      name,
      score,
      picture: pictureHash,
    };
    const ranking = readStorage(RANKING);
    if (!ranking.length) saveInStorage(RANKING, [newUserRank]);
    else {
      const findInRanking = ranking
        .some(({ gravatarEmail }) => getGravatarImage(gravatarEmail) === pictureHash);
      const newRanking = findInRanking ? ranking
        .reduce((acc, user) => {
          if (getGravatarImage(user.gravatarEmail) === pictureHash) {
            return [...acc, newUserRank];
          }
          return [...acc, user];
        }, [])
        : [...ranking, newUserRank];
      saveInStorage(RANKING, newRanking);
    }
    localStorage.removeItem(TOKEN);
  };

  nextQuestion = () => {
    const { history, triviaQuestions } = this.props;
    const { questionIndex } = this.state;
    const lastQuestionIndex = triviaQuestions.length - 1;
    if (questionIndex === lastQuestionIndex) {
      this.saveUserRank();
      history.push('/feedback');
    }
    this.setState({ questionIndex: questionIndex + 1, timer: 30, isDisabled: false });
  };

  timer = () => {
    const ONE_SECOND = 1000;
    const timerID = setInterval(() => {
      const { timer } = this.state;
      const actualTime = timer - 1;
      this.setState({ timer: actualTime });
      if (actualTime <= 0) {
        this.disableQuestion();
        clearInterval(timerID);
      }
    }, ONE_SECOND);
    this.setState({ timerID });
  };

  playerScore = () => {
    const { timer, questionIndex } = this.state;
    const { triviaQuestions, dispatchPlayerScore } = this.props;
    const { difficulty } = triviaQuestions[questionIndex];
    const TEN = 10;
    const points = TEN + (timer * DIFFICULTY_SCORE[difficulty]);
    this.disableQuestion();
    dispatchPlayerScore(points);
  };

  render() {
    const { questionIndex, isDisabled, timer } = this.state;
    const { triviaQuestions, requesting } = this.props;

    return (
      <div>
        <Header />
        {
          requesting || !triviaQuestions.length
            ? 'Loading...'
            : (
              <div>
                <GameQuestion
                  curQuestion={ triviaQuestions[questionIndex] }
                  timer={ timer }
                />
                <GameButtons
                  curQuestion={ triviaQuestions[questionIndex] }
                  nextQuestion={ this.nextQuestion }
                  disableQuestion={ this.disableQuestion }
                  playerScore={ this.playerScore }
                  isDisabled={ isDisabled }
                  timer={ timer }
                />
              </div>
            )
        }
      </div>
    );
  }
}

Game.defaultProps = {
  error: '',
  triviaQuestions: [],
};

Game.propTypes = {
  error: PropTypes.string,
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  dispatchTriviaQuestions: PropTypes.func.isRequired,
  dispatchPlayerScore: PropTypes.func.isRequired,
  triviaQuestions: PropTypes.arrayOf(PropTypes.shape()),
  requesting: PropTypes.bool.isRequired,
  player: PropTypes.shape().isRequired,
};

const mapStateToProps = ({ apiReducer, player }) => ({
  error: apiReducer.error,
  token: apiReducer.token,
  triviaQuestions: apiReducer.triviaQuestions,
  requesting: apiReducer.requesting,
  player,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchTriviaQuestions: (token) => dispatch(fetchTrivia(token)),
  dispatchPlayerScore: (points) => dispatch(sumScoreAct(points)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
