import express from "express";
const Credential = require('../models/CredentialModel');
import {Model} from "sequelize";
const router = express.Router();
const { postCredentials, getCredentialsByUUID, deleteCredentialsByUUID } = require("../controllers/credentialController")
const passport = require('passport');

router.post('/', (req: any, res: any, next: any) => {
    postCredentials(req, res);
});

router.get('/', (req: any, res: any, next: any) => {
    passport.authenticate('google', {session: true}), (req: any, res: any, next: any) => {
        const userId = req.user.id;

        Credential.findOne({
            where: {
                references: req.user.id
            }
        })
            .then((cred: Model|null) => {
                res.send(cred)
            })
    }
    });

router.delete('/:uuid', (req: any, res: any, next: any) => {
    deleteCredentialsByUUID(req, res);
});

module.exports = router;