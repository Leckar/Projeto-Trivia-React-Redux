// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';

class Header extends Component {
  /* componentDidMount() {
    const { gravatarEmail, setGravatarImage } = this.props;
    const gravatarImage = `https://www.gravatar.com/avatar/${md5(gravatarEmail).toString()}`;

    setGravatarImage(gravatarImage);
  } */

  render() {
    const { gravatarEmail, name, score } = this.props;

    return (
      <header>
        <h1>Header</h1>
        <figure>
          <img
            data-testid="header-profile-picture"
            src={ `https://www.gravatar.com/avatar/${md5(gravatarEmail).toString()}` }
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
  // setGravatarImage: PropTypes.func.isRequired,
};

const mapStateToProps = ({ player }) => ({
  name: player.name,
  gravatarEmail: player.gravatarEmail,
  score: player.score,
});

export default connect(mapStateToProps)(Header);
