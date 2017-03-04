/**
 * Created by airing on 2017/3/4.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');

var Invitation = sequelize.define(
    'invitation',
    {
        'uid': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'code': {
            'type': Sequelize.STRING(45),
            'allowNull': false
        },
        'used': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        }
    }
);

Invitation.sync();

module.exports = Invitation;