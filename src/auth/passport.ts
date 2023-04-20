import axios from "axios";
const User = require("../models/UserModel");
const Did = require('../models/DidModel');
const Credential = require("../models/CredentialModel")
const passport = require('passport');
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {DOCKIO_API_TOKEN, DOCKIO_BASE_URL, DOCKIO_ISSUER_DID} = require('../config/env.config');
const GoogleCallbackUrl = "http://localhost:4000/auth/google/redirect";

function getEmailDomain(email: string) {
    // extract domain using regex
    var regex = /@[a-z0-9\-]+\.[a-z]{2,}$/i;
    var domain = email.match(regex);

    if (domain) {
        // remove '@' symbol from the domain
        return domain[0].slice(1);
    } else {
        // return null if no domain found
        return null;
    }
}

// This strategy is called when a user tries logging using the Google OAUTH button
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GoogleCallbackUrl,
        passReqToCallback: true
    }, async (req: any, accessToken: any, refreshToken: any, profile: any, cb: any) => {
        console.log("DEBUG - Profile info: ", profile);
        console.log("Looking for user email in our database ...")
        // TODO: Optionally, check the domain for *@sjsu.edu to verify association with school
        if (getEmailDomain(profile.emails[0].value) !== "sjsu.edu") {
            return cb("402", null);
        }
        try {
            const [user, created] = await User.findOrCreate({
                where: {
                    email: profile.emails[0].value
                },
                defaults: {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    familyName: profile.name.familyName,
                    givenName: profile.name.givenName,
                    verified: true,
                    imageUri: profile.photos[0].value
                }
            });
            // If new user is created, then also generate and insert a new DID for this user
            if (created) {
                console.log("Created new user record !");
                console.log("DEBUG - USER :", user)
                console.log("Generating DID using Dock.io ...")
                // Make a call to Dock.io API to create a new DID for new user
                const didResponse = await axios.post(DOCKIO_BASE_URL + "dids", {}, {
                    headers: {
                        "DOCK-API-TOKEN": DOCKIO_API_TOKEN
                    }
                });
                // Insert the DID into the database
                console.log("Inserting new record for user:", user.id ,"'s generated DID ...")
                console.log(didResponse.data)
                const did = await Did.create({
                    dockioId: didResponse.data.id,
                    didStr: didResponse.data.data.did,
                    hexDidStr: didResponse.data.data.hexDid,
                    controllerStr: didResponse.data.data.controller,
                    references: user.id
                })
                console.log(did)
                // TODO: Cannot make more than 2 api calls in same timeframe on free-tier
                // Add delay as a workaround
                const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
                console.log("Waiting 5 seconds before creating credential...")
                await delay(5000)
                const credentialResponse = await axios.post(DOCKIO_BASE_URL + "credentials", {
                    "anchor": false,
                    "persist": true,
                    "password": "password", //TODO: Changeme!
                    "credential": {
                        "name": "SJSU",
                        "id": "http://example.com",
                        "type": ["VerifiableCredential"],
                        "subject": {
                            "id": didResponse.data.did,
                            "name": profile.displayName,
                            "email": profile.emails[0].value
                        },
                        "issuer": DOCKIO_ISSUER_DID, // PseudoPass ISSUER DID
                        "issuanceDate": "2023-03-01T00:00:00Z" // TODO: Get today's date in UTC time
                    },
                }, {
                    headers: {
                        "DOCK-API-TOKEN": DOCKIO_API_TOKEN
                    }});
                console.log(credentialResponse.data)
                const vc = await Credential.create({
                    credentialId: credentialResponse.data.id,
                    credentialSubject: credentialResponse.data.credentialSubject,
                    proof: credentialResponse.data.proof,
                    issuanceDate: credentialResponse.data.issuanceDate,
                    password: "password", //TODO: Changeme!
                    references: user.id
                })
            }
            console.log("Logging in ...", user.dataValues);
            // TODO: Double check this logic, unsure if data being kept in user or user[0] when returning [user, created] on User.findOrCreate
            if (user || user[0]) {
                return cb(null, user);
            }
            else {
                return cb("500", null);
            }
        } catch (err) {
            console.log(err)
            cb(err, null)
        }
    }

))

passport.serializeUser((user: any, cb: any) => {
    console.log("Serializing:", user);
    cb(null, user.id);
});

passport.deserializeUser(async (id: any, cb: any) => {
    const user = await User.findOne({ where: {id} }).catch((err: any) => {
        console.log("Error deserializing", err);
        cb(err, null);
    })
    console.log("Deserialized user", user)
    if (user) cb(null, user);
});

passport.use(
    new StrategyJwt(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        function (jwtPayload: any, done: any) {
            return User.findOne({ where: { id: jwtPayload.id } })
                .then((user: any) => {
                    return done(null, user);
                })
                .catch((err: any) => {
                    return done(err);
                });
        }
    )
);
