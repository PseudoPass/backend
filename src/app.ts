import express from "express";
import * as fs from "fs";

// Environment
const { CORS_ORIGIN_URL, NODE_ENV, REDIS_HOST, REDIS_PORT, SQL_DATABASE, EXPRESS_SERVER_PORT, EXPRESS_SESSION_SECRET} = require("./config/env.config");

// Express Server
const app: any = express();
const http = require('http');
const https = require('https');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
// Define middleware
app.use(express.json());
app.use(cookieParser());
// CORS
const cors = require('cors');
app.use(cors({
    origin: CORS_ORIGIN_URL,
    credentials: true
}));
// Express session & Redis store
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});
app.set('trust proxy', 1);
const sessionStore = new redisStore({ client: redisClient  });
app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    sameSite: 'Lax',
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { secure: NODE_ENV === 'production' },
    proxy: true,
}));
// Passport.js
require('./auth/passport');
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
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

if (NODE_ENV == "production") {
    const httpsOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
    // Start HTTPS server listening on selected port
    const server = https.createServer(httpsOptions, app)
    server.listen(EXPRESS_SERVER_PORT, (error?: any) => {
            if(!error)
            {
                console.log("Server is Successfully Running, and App is listening on port " + EXPRESS_SERVER_PORT)
            }
            else
                console.log("Error occurred, server can't start", error);
        }
    );
} else {
    // Start HTTP server listening on selected port
    const server = http.createServer(app)
    server.listen(EXPRESS_SERVER_PORT, (error?: any) => {
            if(!error)
            {
                console.log("Server is Successfully Running, and App is listening on port " + EXPRESS_SERVER_PORT)
            }
            else
                console.log("Error occurred, server can't start", error);
        }
    );
}
