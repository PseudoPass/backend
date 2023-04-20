import express from "express";
import {Model} from "sequelize";
const router = express.Router();
const {createDids, getDid, getDidByUUID, deleteDidByUUID} = require("../controllers/didController");
const Did = require('../models/DidModel');
const passport = require('passport');

router.post('/create', (req: any, res: any, next: any) => {
    console.log("create")
    // This behavior is handled in the passport.js google login route
    createDids(req, res);
});

router.get('/:uuid', (req: any, res: any, next: any) => {
    getDidByUUID(req, res);
});


router.get('/', passport.authenticate('google', {session: true}), (req: any, res: any, next: any) => {
    const userId = req.user.id;

    Did.findOne({
        where: {
            references: req.user.id
        }
    })
        .then((did: Model|null) => {
            res.send(did)
        })
});

router.delete('/:uuid', (req: any, res: any, next: any) => {
    deleteDidByUUID(req, res);
});

module.exports = router;