import handleResponse from "../utils/handleResponse";
import axios from 'axios';
const User = require('../models/UserModel');

exports.checkToken = (req: any, res: any) => {
    const body = req.body;
    // Check if user is logging in from a '*@sjsu.edu' domain
    if (req.body.hd != "sjsu.edu") {
        handleResponse(req, res, 403, "Not a SJSU domain");
    }
    console.log(req.body)
    // Determine if this is a new user
    // const email = req.body.email;
    const email = "";
    User.findOne({
        where: {
            email: email
        }
    })
}