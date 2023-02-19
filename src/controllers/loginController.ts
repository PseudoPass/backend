const User = require('../models/UserModel');
exports.checkToken = (req: any, res: any) => {
    const body = req.body;
    if (req.body.hd != "sjsu.edu") {
        console.log("Not a SJSU domain, deny request")
        req.send(403)
    }
    console.log(req.body)
    res.send("Hello world");
}