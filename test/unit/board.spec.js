/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */
const expect = require('chai').expect;
const Board = require('../../dst/models/board');

describe('Board', () => {
  describe('constructor', () => {
    it('should create a board', done => {
      // const b = new Board({ p1pieces: whitePieces, p2pieces: bluePieces });
      const b = new Board();
      b.validate(err => {
        expect(err).to.be.undefined;
        expect(b.p1pieces).to.be.ok;
        expect(b.p1pieces).to.have.length(12);
        b.p1pieces.forEach(p => {
          expect(p.x).to.be.within(0, 7);
          expect(p.y).to.be.within(0, 2);
        });

        expect(b.p2pieces).to.be.ok;
        expect(b.p2pieces).to.have.length(12);
        b.p2pieces.forEach(p => {
          expect(p.x).to.be.within(0, 7);
          expect(p.y).to.be.within(5, 7);
        });
        done();
      });
    });
  });
});
