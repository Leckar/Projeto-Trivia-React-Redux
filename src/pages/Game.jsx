import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import GameButtons from '../components/GameButtons';
import GameQuestion from '../components/GameQuestion';
import { fetchTrivia } from '../redux/actions';

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
    userScore: 0,
  };

  componentDidMount() {
    const {
      token,
      dispatchTriviaQuestions,
    } = this.props;

    dispatchTriviaQuestions(token);
  }

  componentDidUpdate({ triviaQuestions: prevTriviaQuestion }) {
    const {
      error,
      history,
      triviaQuestions,
    } = this.props;

    if (prevTriviaQuestion !== triviaQuestions) this.timer();
    if (error) history.push('/');
  }

  disableQuestion = () => {
    console.log(1);
    this.setState({ isDisabled: true });
  };

  nextQuestion = () => {
    const { history } = this.props;
    const { questionIndex } = this.state;
    const lastQuestionIndex = 4;
    if (questionIndex === lastQuestionIndex) history.push('/feedback');
    this.setState({ questionIndex: questionIndex + 1, timer: 30 });
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
  };

  playerScore = () => {
    const { timer, questionIndex } = this.state;
    const { triviaQuestions } = this.props;
    const { difficulty } = triviaQuestions[questionIndex];
    const TEN_SECONDS = 10;
    const points = TEN_SECONDS + (timer * DIFFICULTY_SCORE[difficulty]);
    this.setState((prevState) => ({
      userScore: prevState.userScore + points,
    }));
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

Game.propTypes = {
  error: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  dispatchTriviaQuestions: PropTypes.func.isRequired,
  triviaQuestions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  requesting: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ apiReducer }) => ({
  error: apiReducer.error,
  token: apiReducer.token,
  triviaQuestions: apiReducer.triviaQuestions,
  requesting: apiReducer.requesting,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchTriviaQuestions: (token) => dispatch(fetchTrivia(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
