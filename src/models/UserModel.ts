const Sequelize = require('sequelize');
const db = require('../config/sequelize.config');

const UserModel = db.define('user', {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
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