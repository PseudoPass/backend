const Sequelize = require('sequelize');
const db = require('../config/sequelize.config');

const UserModel = db.define('user', {
    googleId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    imageUri: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = UserModel;