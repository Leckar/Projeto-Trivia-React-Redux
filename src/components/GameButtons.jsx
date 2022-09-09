import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class GameButtons extends Component {
  mapWrongAnswers = (answers) => answers.map((answer, index) => (
    <button
      type="button"
      key={ index }
      data-testid={ `wrong-answer-${index}` }
    >
      { answer }
    </button>
  ));

  rightAnswer = (answer) => (
    <button
      type="button"
      key="correct_answer"
      data-testid="correct-answer"
    >
      { answer }
    </button>
  );

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
    const { nextQuestion } = this.props;

    return (
      <section>
        <section data-testid="answer-options">
          { this.randomAnswers(this.mapAnswersButtons()) }
        </section>
        <button
          type="button"
          onClick={ nextQuestion }
        >
          Next
        </button>
      </section>
    );
  }
}

GameButtons.propTypes = {
  curQuestion: PropTypes.shape().isRequired,
  nextQuestion: PropTypes.func.isRequired,
  // requesting: PropTypes.bool.isRequired,
};

/* const mapStateToProps = ({ apiReducer: { requesting, triviaQuestions } }) => ({
  requesting,
}); */

// const mapDispatchToProps = (dispatch) => ({
//   dispatchFetchTrivia: (token) => dispatch(fetchTrivia(token)),
// });

export default connect()(GameButtons);
