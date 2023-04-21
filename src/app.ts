import express from "express";

// Environment
const { CORS_ORIGIN_URL, NODE_ENV, REDIS_HOST, REDIS_PORT, SQL_DATABASE, EXPRESS_SERVER_PORT} = require("./config/env.config");

// Express Server
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
// Define middleware
app.use(express.json());
app.use(cookieParser());
// Express session & Redis store
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});
const sessionStore = new redisStore({ client: redisClient  });
app.use(session({
    secret: 'session-secret123',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
// Passport.js
require('./auth/passport');
const passport = require('passport');
app.use(passport.initialize())  ;
app.use(passport.session());
// CORS
const cors = require('cors');
app.use(cors({
    origin: CORS_ORIGIN_URL,
    credentials: true
}));
// Routes
const authRoutes = require('./routes/authRoutes');
const credentialRoutes = require('./routes/credentialRoutes');
const didRoutes = require('./routes/didRoutes');
const userRoutes = require('./routes/userRoutes');

// Define routes
app.use("/auth", authRoutes);
app.use("/cred", credentialRoutes);
app.use("/did", didRoutes);
app.use("/user", userRoutes);

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