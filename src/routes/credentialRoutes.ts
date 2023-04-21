import express from "express";
const Credential = require('../models/CredentialModel');
import {Model} from "sequelize";
import axios from "axios";
const {DOCKIO_API_TOKEN, DOCKIO_BASE_URL, DOCKIO_ISSUER_DID} = require("../config/env.config");
import {isAuthenticated} from "../utils/isAuthenticated";
const router = express.Router();
const { postCredentials, getCredentialsByUUID, deleteCredentialsByUUID } = require("../controllers/credentialController")
const passport = require('passport');
const User = require("../models/UserModel")
router.post('/', async (req: any, res: any, next: any) => {
    const user = await User.findByPk(req.user.id);
    // Check to see if user already has a credential
    const row = await Credential.findOne({where: { references: user.id}});
    if (row) {
        res.sendStatus(400);
        return;
    }
    // Else; create a new credential for user
    const currentDate = new Date();
    const utcDate = currentDate.toISOString().slice(0, -5) + 'Z';  // TODO: Get today's date in UTC time
    const credentialResponse = await axios.post(DOCKIO_BASE_URL + "credentials", {
        "anchor": false,
        "persist": true,
        "template": "5e59a23c-8af6-4a31-b7d7-9f1b2409fbeb",
        "password": "password", //TODO: Changeme!
        "credential": {
            "name": "SJSU",
            "id": "http://example.com",
            "type": ["StudentIdentityCredential"],
            "subject": {
                "id": user.studentId,
                "name": user.displayName,
                "email": user.email
            },
            "issuer": DOCKIO_ISSUER_DID, // PseudoPass ISSUER DID
            "issuanceDate": utcDate
        },
    }, {
        headers: {
            "DOCK-API-TOKEN": DOCKIO_API_TOKEN
        }});
    console.log(credentialResponse.data)
    const credRes = credentialResponse.data;
    const vc = await Credential.create({
        credentialId: credRes.id,
        credentialSubject: credRes.credentialSubject,
        proof: credRes.proof,
        prettyVC: credRes.prettyVC,
        name: credRes.name,
        issuanceDate: credRes.issuanceDate,
        password: "password", //TODO: Changeme!
        references: user.id
    });
    res.sendStatus(200);
});

router.get('/', (req: any, res: any, next: any) => {

});

router.delete('/:uuid', (req: any, res: any, next: any) => {
    deleteCredentialsByUUID(req, res);
});

module.exports = router;