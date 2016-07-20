import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const whitePieces = [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 5, y: 0 }, { x: 7, y: 0 },
                     { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 }, { x: 6, y: 1 },
                     { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 }];
const bluePieces = [{ x: 0, y: 5 }, { x: 2, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 },
                    { x: 1, y: 6 }, { x: 3, y: 6 }, { x: 5, y: 6 }, { x: 7, y: 6 },
                    { x: 0, y: 7 }, { x: 2, y: 7 }, { x: 4, y: 7 }, { x: 6, y: 7 }];

const schema = new Schema({
  game: { type: mongoose.Schema.ObjectId, ref: 'Game' },
  p1pieces: { type: Array, default: whitePieces },
  p2pieces: { type: Array, default: bluePieces },
});

module.exports = mongoose.model('Board', schema);
