/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names, no-use-before-define */
const expect = require('chai').expect;
const Game = require('../../dst/models/game');
const Player = require('../../dst/models/player');

describe('Game', () => {
  describe('constructor', () => {
    it('should create a game', done => {
      const o = initData();
      const g = new Game({ player1: o.p1._id, player2: o.p2._id });
      g.validate(err => {
        expect(err).to.be.undefined;
        expect(g._id).to.be.ok;
        expect(g.currPlayer).to.equal(1);

        expect(g.p1pieces).to.be.ok;
        expect(g.p1pieces).to.have.length(12);
        g.p1pieces.forEach(p => {
          expect(p.x).to.be.within(0, 7);
          expect(p.y).to.be.within(0, 2);
        });

        expect(g.p2pieces).to.be.ok;
        expect(g.p2pieces).to.have.length(12);
        g.p2pieces.forEach(p => {
          expect(p.x).to.be.within(0, 7);
          expect(p.y).to.be.within(5, 7);
        });

        done();
      });
    });
    it('should create a game: current player 2', done => {
      const o = initData();
      const g = new Game({ player1: o.p1._id, player2: o.p2._id, currPlayer: 2 });
      g.validate(err => {
        expect(err).to.be.undefined;
        expect(g._id).to.be.ok;
        expect(g.currPlayer).to.equal(2);
        done();
      });
    });

    it('should NOT create a game: invalid current player', done => {
      const o = initData();
      const g = new Game({ player1: o.p1._id, player2: o.p2._id, currPlayer: 10 });
      g.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a game: no player1', done => {
      const o = initData();
      const g = new Game({ player2: o.p2._id });
      g.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a game: no player2', done => {
      const o = initData();
      const g = new Game({ player1: o.p1._id });
      g.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});

function initData() {
  return {
    p1: new Player({ name: 'P1' }),
    p2: new Player({ name: 'P2' }),
  };
}
