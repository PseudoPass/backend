import express from "express";
import dotenv from 'dotenv';
dotenv.config();

// Express Server
const app = express();
const PORT = 4000;
const http = require('http');
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

app.use(express.json());
app.post('/', (req: { body: { name: any; }; }, res: { send: (arg0: string) => void; })=>{
    const {name} = req.body;

    res.send(`Welcome ${name}`);
})
// Start listening on selected port
app.listen(PORT, (error?: any) => {
        if(!error)
            console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);