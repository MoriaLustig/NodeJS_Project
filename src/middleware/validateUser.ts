import { Request, Response, NextFunction } from 'express';
import { PlayerCollection } from '../players/player.model';

export async function validateUser(req: Request, res: Response, next: NextFunction) {
  const { mail, password, name } = req.body;

  const existPlayer = await PlayerCollection.findOne({ password, name });
  if (existPlayer) {
     res.status(400).json({ message: 'User already exists.' });
     return;
  }
  const existingPlayer = await PlayerCollection.findOne({ mail });
  if (existingPlayer) {
     res.status(400).json({ message: 'User already exists with this email.' });
     return;
  }

  next();
}