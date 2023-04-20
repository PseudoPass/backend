import express from "express";
import handleResponse from "../utils/handleResponse";
const router = express.Router();
const passport = require('passport');

const successLoginUrl = "http://localhost:3000/login/success"
const errorLoginUrl = "http://localhost:3000/login/error"

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: 'consent'},
    (req:any, res:any) => {
        console.log("hi")
}));

router.get('/google/redirect',
    passport.authenticate('google', {
        successRedirect: successLoginUrl,
        failureRedirect: errorLoginUrl,
        failureMessage: "Cannot login to Google, please try again later"
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.send('Successfully logged in');
    });

router.get("/google/failure", (req: any, res: any) => {
    handleResponse(req, res, 403, "AUTH FAILURE")
});

router.post('/logout', (req: any, res: any, next) => {
    console.log("Logging out user...")
    req.logout(function(err: any) {
        if (err) { return next(err); }
        console.log("Logged out?")
        res.clearCookie('connect.sid', {path: '/'}).status(200).send('Ok.');
    });
});

router.get("/validate", (req: any, res, next) => {
    console.log("Validating user authentication...");
    if (req.user) {
        res.send(req.user);
        console.log("Validated user:", req.user);
        // next();
    } else {
        res.status(401).send("You must login first!");
    }
})
module.exports = router;