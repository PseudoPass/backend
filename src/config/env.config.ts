// This file takes the NODE_ENV environment variable with the starting command
// and then parses the file according to the argument given ex. NODE_ENV='development' node ./bin/www
const dotenv = require('dotenv');
const path = require('path');
// Throw error if node environment is not defined
if (!process.env.NODE_ENV) {
    console.error("Error: NODE_ENV is undefined.\nSet this environment variable to either production or development.")
    process.exit();
}
// set the full env path
const ENV_PATH = (__dirname + "/../../" + process.env.NODE_ENV + '.env')
dotenv.config({
    path: path.resolve(ENV_PATH)
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    EXPRESS_SERVER_HOST: process.env.EXPRESS_SERVER_HOST || 'localhost',
    EXPRESS_SERVER_PORT: process.env.EXPRESS_SERVER_PORT || 4000,
    CORS_ORIGIN_URL: process.env.CORS_ORIGIN_URL || 'http://localhost:3000',
    SQL_HOST: process.env.SQL_HOST || 'localhost',
    SQL_PORT: process.env.SQL_PORT || 5432,
    SQL_USER: process.env.SQL_USERNAME || "postgres",
    SQL_PASS: process.env.SQL_PASSWORD || "postgres",
    SQL_DATABASE: process.env.SQL_DATABASE || "pseudopass",
    SQL_DIALECT: process.env.SQL_DIALECT || "postgres",
    DOCKIO_BASE_URL: process.env.DOCKIO_BASE_URL,
    DOCKIO_API_TOKEN: process.env.DOCKIO_API_TOKEN,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    DOCKIO_ISSUER_DID: process.env.DOCKIO_ISSUER_DID
}
