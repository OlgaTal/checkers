/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
// const cp = require('child_process');

describe('players', () => {
  // beforeEach((done) => {
  //   cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
  //     done();
  //   });
  // });

  describe('post /players', () => {
    it('should create a player', (done) => {
      request(app)
      .post('/players')
      .send({ name: 'Joe' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.player.name).to.equal('Joe');
        expect(rsp.body.player._id).to.be.ok;
        done();
      });
    });
    it('should NOT create a player: empty name', (done) => {
      request(app)
      .post('/players')
      .send({ name: '' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['Path `name` is required.']);
        done();
      });
    });
  });
});
