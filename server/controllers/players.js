/* eslint-disable new-cap, no-use-before-define */

import express from 'express';
import Player from '../models/player';

const router = module.exports = express.Router();

// create
router.post('/', (req, res) => {
  Player.create(req.body, (err, player) => {
    if (err) {
      res.status(400).send({ messages: Object.keys(err.errors).map(v => err.errors[v].message) });
    } else {
      res.send({ player });
    }
  });
});
