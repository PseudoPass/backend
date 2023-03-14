import Sequelize from 'sequelize';
const db = require('../config/sequelize.config');

// {
//     "@context": [
//     "https://www.w3.org/2018/credentials/v1",
//     "https://www.w3.org/2018/credentials/examples/v1"
// ],
//     "id": "http://example.com",
//     "type": [
//     "VerifiableCredential",
//     "UniversityDegreeCredential"
// ],
//     "credentialSubject": {
//     "id": "did:dock:5CDsD8HZa6TeSfgmMcxAkbSXYWeob4jFQmtU6sxr4XWTZzUA",
//         "degree": {
//         "type": "BachelorDegree",
//             "name": "Bachelor of Science and Arts"
//     }
// },
//     "issuanceDate": "2020-08-24T14:15:22Z",
//     "proof": {
//     "type": "EcdsaSecp256k1Signature2019",
//         "created": "2021-11-22T22:51:08Z",
//         "verificationMethod": "did:dock:5FfmGmkY1BqEqRQhRLCLDLHPBFvhSbEBK3DJhEk9mbkpfAXT#keys-1",
//         "proofPurpose": "assertionMethod",
//         "proofValue": "zAN1rKrjNqYSr6mjbNEohqhCAnEoLWFgJutBmYMkXZYG8RatBuCv7ymFHEchufa1vjiM4JkHCkasswjukYVVJT3rBmTaRaUDHT"
// },
//     "issuer": "did:dock:xyz"
// }


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
    issuanceDate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    references: {
        type: Sequelize.STRING,
        allowNull: false,
        model: 'user',
        key: 'userId'
    }
});

module.exports = CredentialModel;