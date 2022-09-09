import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class GameButtons extends Component {
  shouldComponentUpdate({ timer, isDisabled: prevIsDisabled }) {
    const { isDisabled } = this.props;
    return !timer || isDisabled !== prevIsDisabled;
  }

  mapWrongAnswers = (answers) => {
    const { isDisabled, disableQuestion } = this.props;

    return answers.map((answer, index) => (
      <button
        type="button"
        key={ index }
        data-testid={ `wrong-answer-${index}` }
        onClick={ disableQuestion }
        className={ isDisabled ? 'incorrectAnswer' : '' }
        disabled={ isDisabled }
      >
        { answer }
      </button>
    ));
  };

  rightAnswer = (answer) => {
    const { isDisabled, disableQuestion } = this.props;

    return (
      <button
        type="button"
        key="correct_answer"
        data-testid="correct-answer"
        onClick={ disableQuestion }
        className={ isDisabled ? 'correctAnswer' : '' }
        disabled={ isDisabled }
      >
        { answer }
      </button>
    );
  };

  mapAnswersButtons = () => {
    const {
      curQuestion: {
        incorrect_answers: incorrectAnswers,
        correct_answer: correctAnswer,
      },
    } = this.props;

    return [this.rightAnswer(correctAnswer), ...this.mapWrongAnswers(incorrectAnswers)];
  };

  randomAnswers = (answerButtons) => answerButtons.sort(() => {
    const randomAverage = 0.5;
    const positive = 1;
    const negative = -1;
    if (Math.random() > randomAverage) return positive;
    return negative;
  });

  render() {
    const { nextQuestion, isDisabled } = this.props;

    return (
      <section>
        <section data-testid="answer-options">
          { this.randomAnswers(this.mapAnswersButtons()) }
        </section>
        {
          isDisabled && (
            <button
              type="button"
              onClick={ nextQuestion }
              data-testid="btn-next"
            >
              Next
            </button>
          )
        }
      </section>
    );
  }
}

GameButtons.propTypes = {
  curQuestion: PropTypes.shape().isRequired,
  nextQuestion: PropTypes.func.isRequired,
  disableQuestion: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  timer: PropTypes.number.isRequired,
  // requesting: PropTypes.bool.isRequired,
};

/* const mapStateToProps = ({ apiReducer: { requesting, triviaQuestions } }) => ({
  requesting,
}); */

// const mapDispatchToProps = (dispatch) => ({
//   dispatchFetchTrivia: (token) => dispatch(fetchTrivia(token)),
// });

export default connect()(GameButtons);
