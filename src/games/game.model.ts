import mongoose from 'mongoose';

import { Document } from "mongoose";

const GameSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    playerId: mongoose.Types.ObjectId,
    secretCode: [Number], 
    attempts: [
      {
        guess: [Number],
        bulls: Number,
        pgias: Number,
        createdAt: { type: Date, default: Date.now } 
      }
    ],
    status: { type: String, enum: ['in-progress', 'won', 'lost', 'ended'] },
    maxAttempts: Number,
    winner: Boolean,
    createdAt: { type: Date, default: Date.now } 
});
export const GameCollection = mongoose.model('Game', GameSchema);

export interface IGame extends Document {
  _id: mongoose.Types.ObjectId;
  playerId:mongoose.Types.ObjectId;
  secretCode: number[];
  attempts: Array<{
      guess: number[];
      bulls: number;
      pgias: number;
      createdAt: Date;
  }>;
  status: 'in-progress' | 'won' | 'lost' | 'ended';
  maxAttempts: number;
  winner: boolean;
  createdAt: Date;
}
