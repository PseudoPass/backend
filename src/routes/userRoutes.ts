import express, {NextFunction} from "express";
import handleResponse from "../utils/handleResponse";
const router = express.Router();
const passport = require('passport');
const User = require("../models/UserModel")
const successLoginUrl = "http://localhost:3000/login/success"
const errorLoginUrl = "http://localhost:3000/login/error"
import { isAuthenticated } from '../utils/isAuthenticated';


router.get("/profile", isAuthenticated, (req: any, res, next: NextFunction) => {
    if (req.user) {
        res.send(req.user)
        console.log(req.user)
    } else {
        res.status(401).send("You must login first!");
    }
})

//
router.post("/studentid", isAuthenticated, (req: any, res: any) => {
    console.log("Updating student id...")
    console.log(req.body)
    console.log(req.user.id)
    User.update({ studentId: req.body.sjsuId}, {where: {id: req.user.id} })
        .then((result: any) => {
            console.log("SUCCESS. Updated user's student id")
            console.log(result)
            res.send(result)
        })
        .catch((err: any) => {
            console.log("ERROR. Something went wrong during student id update process")
            res.status(500).send("Something went wrong during student id update process")
        })
});


module.exports = router;