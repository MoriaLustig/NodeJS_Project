import { Router, Request, Response } from 'express';
import gameService from "./game.service";
import mongoose from 'mongoose';
import { GameCollection } from './game.model';
import {validateGuess}from '../middleware/validateGame'
import {validatePlayer} from '../middleware/validateParameters'

export const router = Router();

router.post('/start',validatePlayer, async (req, res) => {
    const name = req.body.name;  
    const password=req.body.password;
    await gameService.startGame(name,password).then(response=>res.status(201).json(`Welcome to Mastermind! Try to guess the secret code (4 unique numbers from 1 to 9).your game id is: ${response} please save this for further use in this game `)).catch(error=>  res.status(500).json({ error: error.message }))
   
});

router.post('/:gameId/guess',validateGuess, async (req, res) => {
    const guessArray = req.body.guess; 
   await gameService.evaluateGuess(guessArray, new mongoose.Types.ObjectId(req.params.gameId))
        .then(response => {
            res.json(response); 
        })
        .catch(error => {
            res.status(500).json({ error: error.message }); 
        });
});

router.get('/:gameId', async (req, res) => {
    const gameId = req.params.gameId;              
    await gameService.getGameStatus(gameId)
    .then(response => {
        res.json(response); 
    })
    .catch(error => {
        res.status(500).json({ error: error.message }); 
    });
});

router.post('/:gameId/end', async (req, res) => {
    const id = req.params.gameId;              
   await gameService.endGame(id).then(  response=> res.status(200).json("the game ended")).catch(error => {
    res.status(500).json({ error: error.message }); 
});
});

