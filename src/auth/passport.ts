const User = require("../models/UserModel");
const passport = require('passport');
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleCallbackUrl = "http://localhost:4000/auth/google/redirect";

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GoogleCallbackUrl,
        passReqToCallback: true
    }, async (req: any, accessToken: any, refreshToken: any, profile: any, cb: any) => {
        console.log("DEBUG - Profile info: ", profile);
        // Optionally, check the domain for *@sjsu.edu to verify association with school
        const user = await User.findOrCreate({
            where: {
                googleId: profile.id,
                displayName: profile.displayName,
                familyName: profile.name.familyName,
                givenName: profile.name.givenName,
                email: profile.emails[0].value,
                verified: true,
                imageUri: profile.photos[0].value
            },
        }).catch((err: any) => {
            console.log("Error signing up", err);
            cb(err, null);
        });
        if (user && user[0]) return cb(null, user && user[0]);
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
