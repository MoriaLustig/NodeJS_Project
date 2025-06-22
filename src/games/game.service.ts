import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { GameCollection } from "./game.model";
import { IGame } from "./game.model";
import { IPlayer, PlayerCollection } from "../players/player.model";
import {generateSecretCode,countBulls,countPgias} from'./game.logic';
export default class gameService {
    static async checkUser(name: string, password: string) {
        const player = await PlayerCollection.findOne<IPlayer>({ name: name });
        if (!player) {
            throw new Error("incorrect name");
        }
        const isCorrectPassword = await bcrypt.compare(password, player.password);
        if (!isCorrectPassword) {
            throw new Error("incorrect password ");
        }
        return player;
    }

static async startGame(name: string, password: string) {
    const player=await this.checkUser(name, password);
    const newGame = new GameCollection({
        _id: new mongoose.Types.ObjectId(),
        playerId: player._id,
        secretCode: generateSecretCode(),
        attempts: [],
        status: 'in-progress',
        maxAttempts: 10,
        winner: false,
        createdAt: Date.now() 
    });
    if (!newGame) {
    throw new Error('Failed to create a new game');
}
    try{
        const game = await newGame.save();
         if(!game)
            throw("error saving game");
   
        player.games.push(game._id as mongoose.Types.ObjectId);
        player.save();
        console.log('Game has been saved to the database.');
        console.log('Welcome to Mastermind! Try to guess the secret code (4 unique numbers from 1 to 9).');
    } catch (error) {
        throw new Error('Error saving game to the database');
    }
    return newGame._id;
}

static async  getGameStatus(gameId: string): Promise<{ status: string ,attempts:any}> {
    try {
        const game = await GameCollection.findById(gameId);
        if (!game) {
            throw new Error("Game not found");}
        let Attempts= game.attempts
        return { status: game.status || 'unknown',attempts:Attempts }; 
    } catch (error) {
        console.error('Error retrieving game status:', error);
        throw error;
    }
}
static async  endGame(gameId: string): Promise<void> {
    const game = await GameCollection.findById(gameId);
    if (game) {
        game.status = 'ended';
        game.save()
    } else {
        throw new Error('Game not found');
    }
}
static async  getGame(_id: mongoose.Types.ObjectId): Promise<IGame> {
    const game = await GameCollection.findById(_id) as IGame;
    if (!game) {
        throw new Error('Game not found');
    }
    return game;
}
static async  evaluateGuess(guess: number[], _id: mongoose.Types.ObjectId) {
    const game = await this.getGame(_id);
    if (game.status !== 'in-progress') {
        throw new Error('Game inactive');
    }
    const bulls: number = countBulls(guess, game.secretCode);
    const pgias: number = countPgias(guess, game.secretCode);
    game.attempts.push({
        guess: guess,
        bulls: bulls,
        pgias: pgias,
        createdAt: new Date()
    });
    if (bulls === game.secretCode.length) {
        game.status = 'won';
        game.winner = true;
        await game.save();
        return "hooray, you won!!:) :) :)"
    } else if (game.attempts.length == game.maxAttempts) {
        game.status = 'lost';
        game.winner = false;
        await game.save();
        return  "you lost :( :( :( !!";
    }
    await game.save();
    return { correctPosition: bulls, correctNumber: pgias, status: game.status ,remainingAttempts:game.maxAttempts-game.attempts.length};
}
}