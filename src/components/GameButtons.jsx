import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import decodeHTMLEntities from '../services/decodeHTMLEntities';

class GameButtons extends Component {
  state = {
    randomizedAnswers: [],
  };

  componentDidMount() {
    this.setState({ randomizedAnswers: this.randomAnswers(this.mapAnswers()) });
  }

  componentDidUpdate({ isDisabled: prevIsDisabled }) {
    const { isDisabled } = this.props;
    if (prevIsDisabled && !isDisabled) {
      this.setState({ randomizedAnswers: this.randomAnswers(this.mapAnswers()) });
    }
  }

  mapAnswers = () => {
    const {
      curQuestion: {
        incorrect_answers: incorrectAnswers,
        correct_answer: correctAnswer,
      },
    } = this.props;
    const answers = [...incorrectAnswers, correctAnswer];

    return answers.map((answer) => decodeHTMLEntities(answer));
  };

  mapAnswerButton = (answer, i) => {
    const {
      isDisabled,
      disableQuestion,
      playerScore,
      curQuestion: { correct_answer: correctAnswer },
    } = this.props;
    const decodedAnswer = decodeHTMLEntities(correctAnswer);
    return (
      <button
        type="button"
        key={ i }
        data-testid={ answer === decodedAnswer ? 'correct-answer' : `wrong-answer-${i}` }
        onClick={ answer === decodedAnswer ? playerScore : disableQuestion }
        className="answer"
        disabled={ isDisabled }
      >
        { answer }
      </button>
    );
  };

  mapAnswerButtons = () => this.mapAnswers()
    .map((answer, ind) => this.mapAnswerButton(answer, ind));

  randomAnswers = (answerButtons) => answerButtons.sort(() => {
    const randomAverage = 0.5;
    return Math.random() - randomAverage;
  });

  sortedButtons = () => {
    const { randomizedAnswers } = this.state;
    console.log('----------------');
    console.log(this.mapAnswerButtons());
    return this.mapAnswerButtons()
      .sort(({ props: { children: childrenA } }, { props: { children: childrenB } }) => {
        const indA = randomizedAnswers.indexOf(childrenA);
        const indB = randomizedAnswers.indexOf(childrenB);
        console.log('-----');
        console.log(randomizedAnswers);
        console.log(childrenA, indA);
        console.log(childrenB, indB);
        return indA - indB;
      });
  };

  render() {
    const { isDisabled, nextQuestion } = this.props;

    return (
      <section>
        <section data-testid="answer-options">
          { this.sortedButtons() }
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
  playerScore: PropTypes.func.isRequired,
};

export default connect()(GameButtons);
