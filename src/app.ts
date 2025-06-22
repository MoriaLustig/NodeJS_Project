import express, { Request, Response }  from 'express';
import {router as playerRouter} from './players/player.controller';
import {router as gameRouter} from './games/game.controller';
import {myDB} from './db/connection';
const app = express();
app.use(express.json());
myDB.getDB();
app.use('/api/players', playerRouter);
app.use('/api/games', gameRouter);
app.use((err: Error, req: Request , res: Response, next: any) => {
    console.log(Error);
     console.error('Error message:', err.message); // Log the error message
    console.error('Stack trace:', err.stack); //
    res.status(500).send('משהו השתבש!');
});
export default app;