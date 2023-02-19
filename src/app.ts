import express from "express";
import dotenv from 'dotenv';
const { NODE_ENV, SQL_DATABASE} = require("./config/env.config");
dotenv.config();

// Express Server
const app = express();
const PORT = 4000;
const http = require('http');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cookieParser = require('cookie-parser');
app.use(jsonParser); // use it globally
// CORS
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
// Environment

// Routes
const credentialRoutes = require('./routes/credentialRoutes');
const didRoutes = require('./routes/didRoutes');
const loginRoutes = require('./routes/loginRoutes');

// Define routes
app.use("/credentials", credentialRoutes);
app.use("/dids", didRoutes);
app.use("/login", loginRoutes);

// Define middleware
app.use(express.json());
app.use(cookieParser());

// Show some debug message to show environment is correct
console.log("Environment:", NODE_ENV, "\nDatabase:", SQL_DATABASE);
// Start listening on selected port
http.createServer(app);
http.listen(PORT, (error?: any) => {
        if(!error)
            console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);