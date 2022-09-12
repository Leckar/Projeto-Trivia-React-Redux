// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Ranking extends Component {
  render() {
    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        <Link to="/">
          <button type="button" data-testid="btn-go-home">Voltar ao início</button>
        </Link>
      </div>
    );
  }
}

// Ranking.propTypes = {

// };

export default connect()(Ranking);
