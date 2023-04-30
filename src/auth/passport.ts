import axios from "axios";
const User = require("../models/UserModel");
const Did = require('../models/DidModel');
const passport = require('passport');
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { EXPRESS_SERVER_URL, DOCKIO_API_TOKEN, DOCKIO_BASE_URL } = require('../config/env.config');

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
        callbackURL: `${EXPRESS_SERVER_URL}/auth/google/redirect`,
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
                console.log("Created new DID record", did)
            }
            console.log("Logging in ...", user);
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

passport.serializeUser((user: any, done: any) => {
    console.log("Serializing:", user);
    done(null, user.id);
});
passport.deserializeUser((id: any, done: any) => {

    User.findOne({ where: { id: id } })
        .then((user: any) => {
            console.log("Deserialized user", user)
            done(null, user);
        })
        .catch((err: any) => {
            console.log("Error deserializing", err);
            done(err, null);
        });
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

