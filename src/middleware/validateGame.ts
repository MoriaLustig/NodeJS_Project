import { Request, Response, NextFunction } from 'express';

export function validateGuess(req: Request, res: Response, next: NextFunction): void {
  const { guess } = req.body;

  if (!Array.isArray(guess)) {
    res.status(400).json({ message: 'A guess must be an array of numbers.' });
    return;
  }

  if (guess.length !== 4) {
    res.status(400).json({ message: 'Guess must be 4 in length.' });
    return;
  }

  if (!guess.every(num => typeof num === 'number' && num >= 0 && num <= 9)) {
    res.status(400).json({ message: 'A guess must be 4 characters long. All values ​​in a guess must be numbers between 0 and 9.' });
    return;
  }

  const hasDuplicates = new Set(guess).size !== guess.length;
  if (hasDuplicates) {
    res.status(400).json({ message: 'There must be no duplicates in the guess.' });
    return;
  }

  next();
}



