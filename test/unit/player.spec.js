/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */
const expect = require('chai').expect;
const Player = require('../../dst/models/player');

describe('Player', () => {
  describe('constructor', () => {
    it('should create a player', done => {
      const p = new Player({ name: 'Player1' });
      p.validate(err => {
        expect(err).to.be.undefined;
        expect(p.name).to.equal('Player1');
        expect(p._id).to.be.ok;
        done();
      });
    });
    it('should NOT create a player: name is missing', done => {
      const p = new Player({});
      p.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a player: name is blank', done => {
      const p = new Player({ name: '' });
      p.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
