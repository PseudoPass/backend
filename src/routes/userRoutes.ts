import express from "express";
import handleResponse from "../utils/handleResponse";
const router = express.Router();
const passport = require('passport');

const successLoginUrl = "http://localhost:3000/login/success"
const errorLoginUrl = "http://localhost:3000/login/error"


router.get("/profile", (req: any, res, next) => {
    // const did = await Did.findOne({
    //     where: {
    //         userId
    //     }
    // })
    if (req.user) {
        res.send(req.user)
        console.log(req.user)
        // next();
    } else {
        res.status(401).send("You must login first!");
    }
})
module.exports = router;