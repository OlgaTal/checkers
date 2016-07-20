/* eslint-disable jsx-quotes, react/prop-types, max-len, no-underscore-dangle */

import React from 'react';
import Cell from './Cell';

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: props.game };
    this.cellClick = this.cellClick.bind(this);
  }

  cellClick(event) {
    const cl = 'selected';
    const currEl = $(event.currentTarget);
    if (currEl.hasClass(cl)) {
      currEl.removeClass(cl);
      return;
    }

    const firstEl = $('.' + cl);
    const e2 = JSON.parse(currEl.attr('data-cell'));
    if (firstEl.length === 1) {
      if (e2.isP1 || e2.isP2) {
        return;
      }
      const e1 = JSON.parse(firstEl.attr('data-cell'));

      currEl.addClass(cl);
      const body = JSON.stringify({ oldX: e1.x, oldY: e1.y, newX: e2.x, newY: e2.y });
      const gameId = this.props.game._id;
      const url = `/games/${gameId}/move`;
      fetch(url, { method: 'put', body, headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(j => {
        if (j.messages) {
          currEl.removeClass(cl);
          console.log(j.messages);
        } else {
          firstEl.removeClass(cl);
          currEl.removeClass(cl);

          this.props.game.p1pieces = j.game.p1pieces;
          this.props.game.p2pieces = j.game.p2pieces;
          this.props.game.currPlayer = j.game.currPlayer;
          this.setState({ game: j.game });
        }
      });
    } else if (firstEl.length === 0 && (e2.isP1 || e2.isP2)) {
      currEl.addClass(cl);
    } else {
      firstEl.removeClass(cl);
    }
  }

  render() {
    const p1 = this.props.game.player1 ? this.props.game.player1.name : '';
    const p2 = this.props.game.player2 ? this.props.game.player2.name : '';
    const rows2 = [];
    const p1p = this.props.game.p1pieces;
    const p2p = this.props.game.p2pieces;
    for (let y = 7; y > -1; y--) {
      const myRow = [];
      for (let x = 0; x < 8; x++) {
        const key = x + '-' + y;
        const isP1 = p1p.find(p => p.x === x && p.y === y) ? true : false;
        const isP2 = p2p.find(p => p.x === x && p.y === y) ? true : false;

        myRow.push([{ x, y, isP1, isP2 }, key]);
      }
      rows2.push([myRow]);
    }

    let arrow = '';
    if (this.props.game.player1) {
      arrow = this.props.game.currPlayer === 1 ? '/img/red.png' : '/img/black.png';
    }

    return (
      <div>
        <div className='row'>
          <div className='col-xs-2' />
          <div className='col-xs-3 highlight center'>{p1}&nbsp;</div>
          <div className='col-xs-2 center'><img src={arrow} role='presentation' height='40' width='40' /></div>
          <div className='col-xs-3 highlight center'>{p2}&nbsp;</div>
          <div className='col-xs-2' />
        </div>
        <div className='row'>
          <div className='col-xs-12'>&nbsp;</div>
        </div>

        {rows2.map((r) =>
          <div className='row'>
            <div className='col-xs-2' />
            {r.map((c) =>
              <span>
              {c.map((c1) =>
                <div className={`col-xs-1 ${((c1[0].x + c1[0].y) % 2 === 0) ? 'dark' : 'light'}`}>
                  <Cell key={c1[1]} cell={c1[0]} onClick={this.cellClick} />
                </div>
              )}
              </span>
            )}
            <div className='col-xs-2' />
          </div>
        )}
      </div>
    );
  }
}

export default Grid;
