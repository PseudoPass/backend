import Sequelize from 'sequelize';
const db = require('../config/sequelize.config');

const DidModel = db.define('did', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dockioId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    didStr: {
        type: Sequelize.STRING,
        allowNull: false
    },
    hexDidStr: {
        type: Sequelize.STRING,
        allowNull: false
    },
    controllerStr: {
        type: Sequelize.STRING,
        allowNull: false
    },
    references: {
        type: Sequelize.INTEGER,
        allowNull: false,
        model: 'user',
        key: 'userId'
    }
});

module.exports = DidModel;