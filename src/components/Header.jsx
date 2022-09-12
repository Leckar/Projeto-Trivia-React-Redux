// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import getGravatarImage from '../services/getGravatarImage';

class Header extends Component {
  render() {
    const { gravatarEmail, name, score } = this.props;

    return (
      <header>
        <h1>Header</h1>
        <figure>
          <img
            data-testid="header-profile-picture"
            src={ getGravatarImage(gravatarEmail) }
            alt={ `Foto de ${name}` }
          />
        </figure>
        <span data-testid="header-player-name">{ name }</span>
        <span data-testid="header-score">{ score }</span>
      </header>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = ({ player }) => ({
  name: player.name,
  gravatarEmail: player.gravatarEmail,
  score: player.score,
});

export default connect(mapStateToProps)(Header);
