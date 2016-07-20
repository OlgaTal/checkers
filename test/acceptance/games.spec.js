/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('games', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populateCheckers.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('put /games/:id/move( move + jump )', () => {
    // player 2 - moves & player 1 jumps
    it('should move a piece - Player2 & Player 1 should jump', (done) => {
      request(app)
      .put('/games/aa234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 5, newX: 3, newY: 4 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game).to.be.ok;
        expect(rsp.body.game.p1pieces).to.deep.equal([{ x: 2, y: 3 }]);
        expect(rsp.body.game.p2pieces).to.deep.equal([{ x: 3, y: 4 }]);
        expect(rsp.body.game.currPlayer).to.equal(1);
        request(app)
          .put('/games/aa234567890123456789abc1/move')
          .send({ oldX: 2, oldY: 3, newX: 4, newY: 5 })
          .end((err1, rsp1) => {
            expect(err1).to.be.null;
            expect(rsp1.status).to.equal(200);
            expect(rsp1.body.game).to.be.ok;
            expect(rsp1.body.game.p1pieces).to.deep.equal([{ x: 4, y: 5 }]);
            expect(rsp1.body.game.p2pieces).to.deep.equal([]);
            expect(rsp1.body.game.currPlayer).to.equal(2);
            done();
          });
      });
    });

    // player 2 - Jumps
    it('should move a piece - Player2', (done) => {
      request(app)
      .put('/games/e1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 4, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game).to.be.ok;
        expect(rsp.body.game.p1pieces).to.deep.equal([]);
        expect(rsp.body.game.p2pieces).to.deep.equal([{ x: 4, y: 3 }]);
        done();
      });
    });
  });

  describe('put /games/:id/move( legal JUMPING )', () => {
    // player 1 - Jumps
    it('should move a piece - Player1', (done) => {
      request(app)
      .put('/games/d1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 6, newY: 5 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game).to.be.ok;
        expect(rsp.body.game.p1pieces).to.deep.equal([{ y: 5, x: 6 }]);
        expect(rsp.body.game.p2pieces).to.deep.equal([]);
        done();
      });
    });

    // player 2 - Jumps
    it('should move a piece - Player2', (done) => {
      request(app)
      .put('/games/e1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 4, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game).to.be.ok;
        expect(rsp.body.game.p1pieces).to.deep.equal([]);
        expect(rsp.body.game.p2pieces).to.deep.equal([{ x: 4, y: 3 }]);
        done();
      });
    });
  });

  describe('put /games/:id/move', () => {
    it('should move a piece - Player1', (done) => {
      request(app)
      .put('/games/a1234567890123456789abc1/move')
      .send({ oldX: 1, oldY: 2, newX: 0, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        done();
      });
    });
    it('should NOT move a piece: not current player', (done) => {
      request(app)
      .put('/games/a1234567890123456789abc1/move')
      .send({ oldX: 0, oldY: 5, newX: 1, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Current player does not have piece position']);
        done();
      });
    });
    it('should NOT move a piece: not an empty position ', (done) => {
      request(app)
      .put('/games/a1234567890123456789abc1/move')
      .send({ oldX: 1, oldY: 2, newX: 0, newY: 7 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['New position taken']);
        done();
      });
    });

    // **************************
    // player 1
    // **************************
    it('should NOT move a piece: Player1 illigal move - out of bounds - min', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: -4, newY: 4 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - out of bounds - max', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 4, newY: 8 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - straight', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 4, newY: 4 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - left', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 3, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - right', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 5, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - backwards', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 4, newY: 2 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - backwards diagonal left', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 3, newY: 2 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - backwards diagonal right', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 5, newY: 2 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player1 illigal move - more than 1 cell', (done) => {
      request(app)
      .put('/games/b1234567890123456789abc1/move')
      .send({ oldX: 4, oldY: 3, newX: 2, newY: 5 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });

    // **************************
    // player 2
    // **************************
    it('should move a piece - Player2', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 4, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game).to.be.ok;
        expect(rsp.body.game.p1pieces).to.deep.equal([]);
        expect(rsp.body.game.p2pieces).to.deep.equal([{ x: 4, y: 3 }]);
        expect(rsp.body.game.currPlayer).to.equal(1);

        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - out of bounds - min', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: -4, newY: 4 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - out of bounds - max', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 4, newY: 8 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - straight', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 2, newY: 4 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - left', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 3, newY: 5 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - right', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 1, newY: 5 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - backwards', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 2, newY: 6 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - backwards diagonal left', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 3, newY: 6 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - backwards diagonal right', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 1, newY: 6 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
    it('should NOT move a piece: Player2 illigal move - more than 1 cell', (done) => {
      request(app)
      .put('/games/c1234567890123456789abc1/move')
      .send({ oldX: 2, oldY: 5, newX: 0, newY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Illegal move']);
        done();
      });
    });
  });

  describe('post /games', () => {
    it('should create a game', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '01234567890123456789abc1', player2: '01234567890123456789abc2' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        // console.log('RESP:', rsp);
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.player1.name).to.equal('Joe');
        expect(rsp.body.game.player2.name).to.equal('Chyld');
        expect(rsp.body.game.currPlayer).to.equal(1);
        expect(rsp.body.game.p1pieces).to.be.ok;
        expect(rsp.body.game.p2pieces).to.be.ok;
        done();
      });
    });
    it('should NOT create a game: the 1st player is missing', (done) => {
      request(app)
      .post('/games')
      .send({ player2: '01234567890123456789abc1' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Path `player1` is required.']);
        done();
      });
    });
    it('should NOT create a game: the 2nd player is blank', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '01234567890123456789abc1', player2: '' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Cast to ObjectID failed for value "" at path "player2"']);
        done();
      });
    });
    it('should NOT create a game: player ids are invalid', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '0123', player2: 'GGGGG' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Cast to ObjectID failed for value "GGGGG" at path "player2"',
          'Cast to ObjectID failed for value "0123" at path "player1"']);
        done();
      });
    });
  });
});
