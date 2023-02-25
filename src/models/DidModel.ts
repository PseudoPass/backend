// {
//     "id": "6180",
//     "data": {
//     "did": "did:dock:5CKJ6mvuQtEjKbf8PLA8uqL9w5HxFVmUdZpUaB58mhtxCkLG",
//         "hexDid": "0x0b20b5679bac373c839ca6cc7029e96ed6963a5c3e582f2a43aacb16db3b66b4",
//         "controller": "did:dock:5CKJ6mvuQtEjKbf8PLA8uqL9w5HxFVmUdZpUaB58mhtxCkLG"
// }
// }

import Sequelize from 'sequelize';
const db = require('../config/sequelize.config');

const DidModel = db.define('did', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    didId: {
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
    relation: {
        type: Sequelize.INTEGER,
        model: 'user',
        key: 'id'
    }
});

module.exports = DidModel;