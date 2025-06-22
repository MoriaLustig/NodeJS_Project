import { Router, Request, Response } from 'express';
import { validatePlayer } from '../middleware/validateParameters';
import PlayerService from './player.service';
import mongoose from 'mongoose';
import { validateUser } from '../middleware/validateUser';
export const router = Router();

router.post('/add', validatePlayer,validateUser, async (req, res) => {
try{const playerName = req.body.name;
    const password = req.body.password;
    const mail = req.body.mail;
   
        const player_id = await PlayerService.createPlayer(password, playerName, mail);
        res.status(200).send(`${playerName}, welcome to the team masterMind players, your player_id is: ${player_id}. Save this for use in this game.`);
    } catch (error) {
     res.status(400).send(error);
    }
});
router.get('/leaderboard', async (req, res) => {
    try {

        const winners = await PlayerService.getTenTopWinners();
        res.status(200).json({ message: "Our Top ten winners are:", winners });
    } catch (error) {
        res.status(403).json(`Error: ${error}`);
    }
});


router.get('/:playerid/recent', async (req, res) => {
    try {
        const result = await PlayerService.lastGameResults(new mongoose.Types.ObjectId(req.params.playerid));
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error || 'Error fetching recent games');
    }
});

router.get('/:playerid', async (req, res) => {
    const Id = req.params.playerid;
    try {
        const player = await PlayerService.getPlayerById(new mongoose.Types.ObjectId(Id));
        res.status(200).json(player);
    } catch (error) {
        res.status(400).send(error || 'Invalid player id');
    }
});

router.put('/:playerid', async (req, res) => {
    const password = req.body.password;
    const name = req.body.name;
    const mail = req.body.mail;
    try {
        await PlayerService.updatePlayer(new mongoose.Types.ObjectId(req.params.playerid), password, name, mail);
        res.status(200).send(`${name}, you were updated successfully!`);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:playerid', async (req, res) => {
    try {
        const deletedPlayer = await PlayerService.deletePlayer(new mongoose.Types.ObjectId(req.params.playerid));
        if (deletedPlayer) {
            res.status(200).send(`${deletedPlayer.name}, you were deleted successfully!`);
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        res.status(400).send(error);
    }
});



