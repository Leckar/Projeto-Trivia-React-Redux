// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { readStorage, RANKING } from '../services/localStorage';

class Ranking extends Component {
  sortRanking = (rank) => rank.sort((
    { score: scoreA },
    { score: scoreB },
  ) => scoreB - scoreA);

  mapRanking = (rank) => this.sortRanking(rank)
    .map(({ name, picture, score }, index) => (
      <div key={ picture }>
        <img src={ picture } alt={ name } />
        <h2 data-testid={ `player-name-${index}` }>{ name }</h2>
        <span data-testid={ `player-score-${index}` }>{ score }</span>
      </div>
    ));

  render() {
    const ranking = readStorage(RANKING);

    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        <Link to="/">
          <button type="button" data-testid="btn-go-home">Voltar ao início</button>
        </Link>
        <div>
          { this.mapRanking(ranking) }
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   ranking: state.ranking,
// });

// Ranking.propTypes = {
//   ranking: PropTypes.arrayOf(
//     PropTypes.shape({ name: PropTypes.string, })
//   ).isRequired,
// };

export default connect()(Ranking);
