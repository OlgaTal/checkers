/* eslint-disable func-names */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const whitePieces = [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 5, y: 0 }, { x: 7, y: 0 },
                     { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 }, { x: 6, y: 1 },
                     { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 }];
const bluePieces = [{ x: 0, y: 5 }, { x: 2, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 },
                    { x: 1, y: 6 }, { x: 3, y: 6 }, { x: 5, y: 6 }, { x: 7, y: 6 },
                    { x: 0, y: 7 }, { x: 2, y: 7 }, { x: 4, y: 7 }, { x: 6, y: 7 }];

const schema = new Schema({
  player1: { type: mongoose.Schema.ObjectId, ref: 'Player', required: true, length: 24 },
  player2: { type: mongoose.Schema.ObjectId, ref: 'Player', required: true, length: 24 },
  p1pieces: { type: Array, default: whitePieces },
  p2pieces: { type: Array, default: bluePieces },
  currPlayer: { type: Number, default: 1, min: 1, max: 2 },
  gridSize: { type: Number, default: 8 },
});

schema.methods.movePiece = function (data) {
  const playerPieces = this.currPlayer === 1 ? this.p1pieces : this.p2pieces;
  const pieceToMove = playerPieces.find(p => p.x === data.oldX && p.y === data.oldY);
  // check if pieceToMove found and it belongs to current player
  if (!pieceToMove) {
    return ['Current player does not have piece position'];
  }

  // check new position: valid, empty
  if (data.newX < 0 || data.newX >= this.gridSize ||
      data.newY < 0 || data.newY >= this.gridSize) {
    return ['Illegal move'];
  }

  const p1NewPiece = this.p1pieces.find(p => p.x === data.newX && p.y === data.newY);
  const p2NewPiece = this.p2pieces.find(p => p.x === data.newX && p.y === data.newY);

  if (p1NewPiece || p2NewPiece) {
    return ['New position taken'];
  }

  // validate the move: direction (backwards)
  if (data.oldY > data.newY && this.currPlayer === 1 ||
      data.oldY < data.newY && this.currPlayer === 2) {
    return ['Illegal move'];
  }

  const stepX = Math.abs(data.oldX - data.newX);
  const stepY = Math.abs(data.oldY - data.newY);
  // jumping logic
  let didJump = false;
  if (stepX === 2 && stepY === 2) {
    // math of position in between the jump
    const enemyX = (data.oldX + data.newX) / 2;
    const enemyY = (data.oldY + data.newY) / 2;

    const p1Index = this.p1pieces.findIndex(p => p.x === enemyX && p.y === enemyY);
    const p2Index = this.p2pieces.findIndex(p => p.x === enemyX && p.y === enemyY);

    if (this.currPlayer === 1 && p2Index > -1) {
      // remove it
      this.p2pieces.splice(p2Index, 1);
      didJump = true;
    } else if (this.currPlayer === 2 && p1Index > -1) {
      // remove it
      this.p1pieces.splice(p1Index, 1);
      didJump = true;
    }
  }

  if (!didJump) {
    // validate the move: direction, step length
    if (stepX !== 1 || stepY !== 1) {
      return ['Illegal move'];
    }
  }
  // upate this.currPlayer and piecies
  this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  pieceToMove.x = data.newX;
  pieceToMove.y = data.newY;

  this.markModified('p1pieces');
  this.markModified('p2pieces');

  return null;
};

module.exports = mongoose.model('Game', schema);
