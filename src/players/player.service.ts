import { PlayerCollection, IPlayer } from './player.model';
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import gameService from '../games/game.service';
import { IGame } from '../games/game.model';
export default class PlayerService {
    static async getPlayerById(playerId:  mongoose.Types.ObjectId): Promise<IPlayer> {
        const player = await PlayerCollection.findById(playerId) as IPlayer;
        if (!player) {
            throw new Error("Player not found");
        }
        return player;
    }
    static async deletePlayer(playerId: mongoose.Types.ObjectId): Promise<IPlayer> {
       const player=await this.getPlayerById(playerId);

        await PlayerCollection.deleteOne({ _id: playerId });

        return player;
    }
    


static async createPlayer(password: string, name: string, mail: string) {
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

    const newPlayer = new PlayerCollection({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        password: hashedPassword, // Store the hashed password
        mail: mail,
        totalGames: 0,
        wins: 0,
        games: []
    });

    try {
        await newPlayer.save();
        console.log('Player has been saved to the database.');
        return newPlayer._id; 
    } catch (error) {
        console.error('Error saving player to the database:', error);
        throw error;
    }
}
static async lastGameResults(_id: mongoose.Types.ObjectId) {
    const player = await this.getPlayerById(_id);
    console.log('Player:', player); // Log player information

    const gameResults = await Promise.all(player.games.map(async game => {
        const gameDetail = await gameService.getGame(game._id);
        console.log('Game Detail:', gameDetail); // Log each game detail
        return gameDetail;
    }));

    console.log('Game Results:', gameResults); // Log all game results

    const mostRecentGame = gameResults
        .filter(game => game.status === 'won' || game.status === 'lost' || game.status === 'ended')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    console.log('Most Recent Game:', mostRecentGame); // Log the most recent game
    return mostRecentGame; 
}

static async updatePlayer(_id: mongoose.Types.ObjectId,password: string, name: string,mail:string){
   const player=await this.getPlayerById(_id)
player.name=name;
player.password=password;
player.mail=mail
await player.save();
} 
static async getTenTopWinners() {
  const players = await PlayerCollection.find().populate<{ games: IGame[] }>('games');
 
  const playerScores = players.map(player => {
  const completedGames = player.games.filter(game => game.status === 'won'||game.status=='lost');
  const totalAttempts = completedGames.reduce((acc, game) => acc + game.attempts.length, 0);
  const averageAttempts = completedGames.length > 0 ? (totalAttempts / completedGames.length ):0; 
  return {
      name: player.name,
      averageAttempts
    };
    
  }).sort((a, b) =>a.averageAttempts-b.averageAttempts).slice(0, 10);
   console.log(playerScores)
return playerScores
 
}}