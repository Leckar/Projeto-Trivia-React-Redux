import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import GameButtons from '../components/GameButtons';
import GameQuestion from '../components/GameQuestion';
import { fetchTrivia } from '../redux/actions';

export class Game extends Component {
  state = {
    // timer: 30,
    // isDisable: false,
    // gameDificult: 1,
    questionIndex: 0,
    // userScore: 0,
  };

  componentDidMount() {
    // this.timer();
    const {
      token,
      dispatchTriviaQuestions,
    } = this.props;

    dispatchTriviaQuestions(token);
  }

  componentDidUpdate() {
    const {
      error,
      history,
    } = this.props;

    if (error) history.push('/');
  }

  nextQuestion = () => {
    const { questionIndex } = this.state;
    this.setState({ questionIndex: questionIndex + 1 });
  };

  /* timer = () => {
    const ONE_SECOND = 1000;
    const QUESTION_TIME_LIMIT = 30000;

    const timerCooldown = setInterval(() => {
      const { timer } = this.state;
      const actualTime = timer - 1;
      this.setState({ timer: actualTime });
      if (actualTime <= 0) clearInterval(timerCooldown);
    }, ONE_SECOND);
    setTimeout(() => {
      this.setState({ isDisable: true });
    }, QUESTION_TIME_LIMIT);
  };

  playerScore = () => {
    const { timer, gameDificult } = this.setState;
    const TEN_SECONDS = 10;
    const points = TEN_SECONDS + (timer * gameDificult);
    this.setState((prevState) => ({
      userScore: prevState.userScore + points,
    }));
  }; */

  render() {
    const { questionIndex } = this.state;
    const { triviaQuestions, requesting } = this.props;
    console.log(triviaQuestions);
    return (
      <div>
        <Header />
        {
          requesting || !triviaQuestions.length
            ? 'Loading...'
            : (
              <div>
                <GameQuestion curQuestion={ triviaQuestions[questionIndex] } />
                <GameButtons
                  curQuestion={ triviaQuestions[questionIndex] }
                  nextQuestion={ this.nextQuestion }
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
