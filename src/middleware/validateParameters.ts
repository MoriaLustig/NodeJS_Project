import { Request, Response, NextFunction } from 'express';
import { PlayerCollection } from '../players/player.model';

export async function validatePlayer(req: Request, res: Response, next: NextFunction) {
  const { mail, password, name } = req.body;

  // Validate email format
  if (!mail || !/\S+@\S+\.\S+/.test(mail)) {
     res.status(400).json({ message: 'Invalid email address.' });
     return;
  }

  // Validate password length
  if (!password || password.length < 6) { 
     res.status(400).json({ message: 'A password must contain at least 6 characters.' });
     return;
  }

  next();
}
