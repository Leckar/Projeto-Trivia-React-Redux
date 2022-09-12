import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Feedback extends Component {
  render() {
    const { score, assertions, history } = this.props;

    return (
      <main>
        <Header />
        <div data-testid="feedback-text">
          {assertions > 2
            ? <h2> Well Done! </h2>
            : <h2> Could be better... </h2>}

          <h3 data-testid="feedback-total-question">
            { `Você acertou ${assertions} questões!` }
          </h3>

          <h3 data-testid="feedback-total-score">
            { `Um total de ${score} pontos` }
          </h3>

          <button
            type="button"
            onClick={ () => history.push('/') }
            data-testid="btn-play-again"
          >
            Play again
          </button>

          <button
            type="button"
            onClick={ () => history.push('/ranking') }
            data-testid="btn-ranking"
          >
            Ranking
          </button>

        </div>
      </main>
    );
  }
}

Feedback.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  score: state.player.score,
  assertions: state.player.assertions,
});

export default connect(mapStateToProps, null)(Feedback);
