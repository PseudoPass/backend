const db = require('../dist/config/sequelize.config');
const User = require('../dist/models/UserModel');

if (process.env.FORCE) {
    // THIS LINE WILL DELETE EVERYTHING FROM DATABASE!!
    db.sync({force: true})
        .then((result) => {
            console.log(result);
            console.log("Dropped: ", User.name)
            console.log("!--- DATABASE TABLES RESET ---!")
            process.exit(1);
        })
        .catch((err) => {
            console.log(err);
            console.log("FAILURE. SOMETHING WENT WRONG");
            process.exit(5000);
        });
} else {
    console.log("To use this helper script, please set the FORCE environment variable")
    process.exit(0);
}
