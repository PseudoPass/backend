const Sequelize = require('sequelize');
const db = require('../config/sequelize.config');

const UserModel = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    googleId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    familyName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    givenName: {
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
