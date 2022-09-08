import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Trivia extends Component {
  render() {
    return (
      <div>Trivia</div>
    );
  }
}

export default connect()(Trivia);
