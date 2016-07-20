/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */

const expect = require('chai').expect;
const Piece = require('../../dst/models/piece');

describe('piece', () => {
  describe('constructor', () => {
    it('should create a new piece', (done) => {
      const p = new Piece({ x: 2, y: 3 });
      p.validate(err => {
        expect(err).to.be.undefined;
        expect(p._id).to.be.ok;
        expect(p.x).to.equal(2);
        expect(p.y).to.equal(3);
        done();
      });
    });
    it('should NOT create a new piece: x coordinate is out of range', (done) => {
      const p = new Piece({ x: 10, y: 3 });
      p.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a new piece: y coordinate is out of range', (done) => {
      const p = new Piece({ x: 0, y: 13 });
      p.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a new piece: coordiantes are required', (done) => {
      const p = new Piece({});
      p.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
