import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class GameQuestion extends Component {
  render() {
    const { curQuestion: { category, question } } = this.props;

    return (
      <section>
        <h2 data-testid="question-category">{ category }</h2>
        <span data-testid="question-text">{ question }</span>
      </section>
    );
  }
}

GameQuestion.propTypes = {
  curQuestion: PropTypes.shape().isRequired,
  // requesting: PropTypes.bool.isRequired,
};

export default connect()(GameQuestion);
