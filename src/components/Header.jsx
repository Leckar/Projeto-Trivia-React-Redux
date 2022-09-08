// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    return (
      <div>Header</div>
    );
  }
}

// Header.propTypes = {};

export default connect()(Header);
