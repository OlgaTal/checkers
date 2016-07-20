/* eslint-disable new-cap, no-use-before-define */

import express from 'express';
import Game from '../models/game';

const router = module.exports = express.Router();

// create
router.post('/', (req, res) => {
  Game.create(req.body, (err, g) => {
    // HandleError(err);
    if (err) {
      res.status(400).send({ messages: Object.keys(err.errors).map(v => err.errors[v].message) });
    } else {
      Game.findById(g._id)
        .populate('player1')
        .populate('player2')
        .exec((err2, game) => {
          res.send({ game });
        });
    }
  });
});

// move
router.put('/:id/move', (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    if (err) {
      res.status(400).send({ messages: Object.keys(err.errors).map(v => err.errors[v].message) });
    } else {
      const messages = game.movePiece(req.body);
      if (messages) {
        res.status(400).send({ messages });
      } else {
        // update
        game.save((err3) => {
          if (err3) {
            res.status(400).send({ messages: Object.keys(err3.errors)
              .map(v => err3.errors[v].message) });
          } else {
            res.send({ game });
          }
        });
      }
    }
  });
});

// function HandleError(err) {
//   if (err) {
//     res.status(400).send({ messages: Object.keys(err.errors).map(v => err.errors[v].message) });
//   }
// }
