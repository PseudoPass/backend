import express, { NextFunction, Request, Response } from "express";

import handleResponse from "../utils/handleResponse";
import {isAuthenticated} from "../utils/isAuthenticated";
const router = express.Router();
const passport = require('passport');
const { CORS_ORIGIN_URL } = require("../config/env.config");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: 'consent'},
    (req: any, res: any) => {
        console.log("hi")
}));

router.get('/google/redirect',
    passport.authenticate('google', {
        successRedirect:  `${CORS_ORIGIN_URL}/login/success`,
        failureRedirect: `${CORS_ORIGIN_URL}/login/error`,
        failureMessage: "Cannot login to Google, please try again later"
    }),
    function(req: any, res: any) {
        // Successful authentication, redirect home.
        res.send('Successfully logged in');
    });

router.get("/google/failure", (req: any, res: any) => {
    handleResponse(req, res, 403, "AUTH FAILURE")
});

router.post('/logout', (req: any, res: any, next: NextFunction) => {
    console.log("Logging out user...")
    // req.logout(function(err: any) {
    //     if (err) { return next(err); }
    //     console.log("Logged out?")
    //     res.clearCookie('connect.sid', {path: '/'}).status(200).send('Ok.');
    // });
    req.session.destroy((err: Error) => {
        if (err) {
            console.log(err);
        } else {
            req.logout();
            res.redirect('/');
        }
    });

});

router.get("/validate", isAuthenticated, (req: any, res: any, next: NextFunction) => {
    console.log("Validating user authentication...");
    if (req.user) {
        res.send(req.user);
        console.log("Validated user:", req.user);
    } else {
        console.log(req.user)
        res.status(401).send("You must login first!");
    }
})
module.exports = router;