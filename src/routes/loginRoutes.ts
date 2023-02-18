import express from "express";
const router = express.Router();
const { checkToken } = require("../controllers/loginController")

router.post('/', (req: any, res: any, next: any) => {
    checkToken(req, res);
});

router.get('/', (req: any, res: any, next: any) => {
    res.send(200);
});

router.delete('/', (req: any, res: any, next: any) => {

});

module.exports = router;