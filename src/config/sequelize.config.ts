const { Sequelize } = require('sequelize');
// SQL .env variables
const {SQL_DATABASE, SQL_USER, SQL_HOST, SQL_PASS, SQL_PORT, SQL_DIALECT} = require("./env.config");
// Define postgres server configuration
const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASS, {
    host: SQL_HOST,
    port: SQL_PORT,
    dialect: SQL_DIALECT,
    sync: true  //create the table if it does not exist
});
sequelize.sync()
    .then((result: any) => {
        console.log(result);
    })
    .catch((err: any) => {
        console.log(err);
    });
module.exports = sequelize;
export {};