import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const pieceSchema = new Schema({
  x: { type: Number, required: true, min: 0, max: 7 },
  y: { type: Number, required: true, min: 0, max: 7 },
  player: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  board: { type: mongoose.Schema.ObjectId, ref: 'Board' },
});

module.exports = mongoose.model('Piece', pieceSchema);
