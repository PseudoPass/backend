const db = require('../dist/config/sequelize.config');
const User = require('../dist/models/UserModel');

// FORCE WILL DELETE EVERYTHING FROM DATABASE!!
let isForce = false;
if (process.env.FORCE === "1") {
    isForce = true;
}
db.sync({force: isForce})
    .then((result) => {
        isForce ? console.log("Forcefully synced database tables") :
        console.log("Synced: ", User.name)
        console.log("!--- DATABASE TABLES SYNCED ---!")
        process.exit(1);
    })
    .catch((err) => {
        console.log(err);
        console.log("FAILURE. SOMETHING WENT WRONG");
        process.exit(5000);
    });
