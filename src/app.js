"use strict";
exports.__esModule = true;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
// Express Server
var app = (0, express_1["default"])();
var PORT = 4000;
var http = require('http');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var cookieParser = require('cookie-parser');
app.use(jsonParser); // use it globally
// CORS
var cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
// Environment
// Routes
var credentialRoutes = require('./routes/credentialRoutes');
var didRoutes = require('./routes/didRoutes');
var loginRoutes = require('./routes/loginRoutes');
// Define routes
app.use("/credentials", credentialRoutes);
app.use("/dids", didRoutes);
app.use("/login", loginRoutes);
// Define middleware
app.use(express_1["default"].json());
app.use(cookieParser());
// Start listening on selected port
app.listen(PORT, function (error) {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
