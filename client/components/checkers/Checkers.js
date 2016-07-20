/* eslint-disable jsx-quotes, react/prop-types */

import React from 'react';
import Grid from './Grid';

class Checkers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: { p1pieces: [], p2pieces: [] } };
    this.newGame = this.newGame.bind(this);
  }

  newGame(e) {
    e.preventDefault();
    const body = JSON.stringify({ player1: '5789181d416434daa0dcd420',
                                  player2: '5789184e416434daa0dcd421' });
    fetch('/games', { method: 'post', body, headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json())
    .then(j => {
      this.setState({ game: j.game });
    });
  }

  render() {
    return (
      <div>
        <h1>Checkers</h1>
        <form>
          <div className='form-group'>
            <label>Person 1</label>
            <input className='form-control' ref='person1' type='text' />
          </div>
          <div className='form-group'>
            <label>Person 2</label>
            <input className='form-control' ref='person2' type='text' />
          </div>
          <button className='btn btn-primary' onClick={this.newGame}>New Game</button>
          <Grid game={this.state.game} />
        </form>
      </div>
    );
  }
}

export default Checkers;
