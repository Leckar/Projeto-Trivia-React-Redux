import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import convertHTMLEntities from '../services/convertHTMLEntities';

class GameQuestion extends Component {
  render() {
    const {
      curQuestion: {
        category,
        question,
      },
      timer,
    } = this.props;

    return (
      <div>
        <section>
          <h2 data-testid="question-category">{ category }</h2>
          <span data-testid="question-text">{ convertHTMLEntities(question) }</span>
          <span data-testid="question-timer">{ `Tempo restante: ${timer}s` }</span>
        </section>
      </div>
    );
  }
}

GameQuestion.propTypes = {
  curQuestion: PropTypes.shape().isRequired,
  // requesting: PropTypes.bool.isRequired,
  timer: PropTypes.number.isRequired,
};

export default connect()(GameQuestion);
