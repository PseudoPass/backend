import express from "express";

// Environment
const { CORS_ORIGIN_URL, NODE_ENV, SQL_DATABASE, EXPRESS_SERVER_PORT } = require("./config/env.config");

// Express Server
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');

// Passport.js
require('./auth/passport');
const passport = require('passport');
const session = require('express-session')

app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    httpOnly: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// CORS
const cors = require('cors');
app.use(cors({ origin: CORS_ORIGIN_URL, credentials: true }));

// Routes
const credentialRoutes = require('./routes/credentialRoutes');
const didRoutes = require('./routes/didRoutes');
const loginRoutes = require('./routes/loginRoutes');
const authRoutes = require('./routes/authRoutes');

// Define routes
app.use("/credentials", credentialRoutes);
app.use("/dids", didRoutes);
app.use("/login", loginRoutes);
app.use("/auth", authRoutes);

// Define middleware
app.use(express.json());
app.use(cookieParser());

// Show some debug message to show environment is correct
console.log("Environment:", NODE_ENV, "\nDatabase:", SQL_DATABASE);
// Start listening on selected port
http.createServer(app).listen(EXPRESS_SERVER_PORT, (error?: any) => {
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port " + EXPRESS_SERVER_PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);