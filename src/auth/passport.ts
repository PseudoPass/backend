import axios from "axios";
const User = require("../models/UserModel");
const Did = require('../models/DidModel');
const passport = require('passport');
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleCallbackUrl = "http://localhost:4000/auth/google/redirect";
const { createDids } = require('../controllers/didController');
const {DOCKIO_API_TOKEN, DOCKIO_BASE_URL} = require('../config/env.config');


passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GoogleCallbackUrl,
        passReqToCallback: true
    }, async (req: any, accessToken: any, refreshToken: any, profile: any, cb: any) => {
        console.log("DEBUG - Profile info: ", profile);
        console.log("Looking up user email, creating if it does not exist.")
        // TODO: Optionally, check the domain for *@sjsu.edu to verify association with school
        try {
            const user = await User.findOrCreate({
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
            if (false) {
                const response = await axios.post(DOCKIO_BASE_URL + "dids", {}, {
                    headers: {
                        "DOCK-API-TOKEN": DOCKIO_API_TOKEN
                    }
                });
                const did = await Did.create({
                    didId: response.data.id,
                    didStr: response.data.data.did,
                    hexDidStr: response.data.data.hexDid,
                    controllerStr: response.data.data.controller,
                    relation: user.id
                })
            }
            console.log("returning callback", user)
            if (user && user[0]) {
                return cb(null, user && user[0]);
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
