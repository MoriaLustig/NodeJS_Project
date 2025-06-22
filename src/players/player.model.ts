import mongoose, { Document, Schema, Types } from 'mongoose';
import { IGame } from "../games/game.model";


const PlayerSchema = new Schema({
  _id:mongoose.Types.ObjectId,
  name: { type: String, required: true },
  password: { type: String, required: true },
  mail: { type: String, required: false, unique: true },
  totalGames: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  games: [{ type:mongoose.Types.ObjectId, ref: 'Game' }]
});

export const PlayerCollection = mongoose.model('Player', PlayerSchema);
export interface IPlayer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  mail: string;
  totalGames: number;
  wins: number;
  games: mongoose.Types.ObjectId[];
}