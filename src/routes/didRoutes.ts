import express from "express";
import {Model} from "sequelize";
const router = express.Router();
const {createDids, getDid, getDidByUUID, deleteDidByUUID} = require("../controllers/didController");
const Did = require('../models/DidModel');
const passport = require('passport');

// Custom middleware to check if the user is authenticated
function isAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(401);
}

router.post('/create', (req: any, res: any, next: any) => {
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

// router.get('/:uuid', (req: any, res: any, next: any) => {
//     getDidByUUID(req, res);
// });

router.delete('/:uuid', (req: any, res: any, next: any) => {
    deleteDidByUUID(req, res);
});

module.exports = router;