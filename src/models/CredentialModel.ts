import Sequelize from 'sequelize';
const db = require('../config/sequelize.config');

const CredentialModel = db.define('credential', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    credentialId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    credentialSubject: {
        type: Sequelize.JSON,
        allowNull: false
    },
    proof: {
        type: Sequelize.JSON,
        allowNull: false
    },
    prettyVC: {
        type: Sequelize.JSON,
        allowNull: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    issuanceDate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
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

module.exports = CredentialModel;