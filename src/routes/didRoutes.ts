import express from "express";
import {Model} from "sequelize";
const router = express.Router();
const {createDids, getDid, getDidByUUID, deleteDidByUUID} = require("../controllers/didController");
const Did = require('../models/DidModel');
const passport = require('passport');
import { isAuthenticated } from '../utils/isAuthenticated'

router.post('/create', isAuthenticated, (req: any, res: any, next: any) => {
    console.log("create");
    // This behavior is handled in the passport.js google login route
    createDids(req, res);
});

router.get('/test', isAuthenticated, (req: any, res: any, next: any) => {
    const userId = req.user.id;
    console.log(userId);
    Did.findOne({
        where: {
            references: req.user.id
        }
    })
        .then((did: Model|null) => {
            res.send(did)
        })
});

router.get('/', isAuthenticated, (req: any, res: any, next: any) => {
    Did.findOne({where: { references: req.user.id }})
        .then((did: Model|null) => {
            res.send(did);
        });
});

router.delete('/:uuid', isAuthenticated, (req: any, res: any, next: any) => {
    deleteDidByUUID(req, res);
});

module.exports = router;