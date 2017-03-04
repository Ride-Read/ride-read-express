/**
 * Created by airing on 2017/3/3.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');

var User = sequelize.define(
    'user',
    {
        'username': {
            'type': Sequelize.STRING(45),
            'allowNull': false
        },
        'password': {
            'type': Sequelize.STRING(45),
            'allowNull': false
        },
        'sex': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'school': {
            'type': Sequelize.STRING(45),
            'allowNull': true
        },
        'phonenumber': {
            'type': Sequelize.STRING(20),
            'allowNull': true
        },
        'follower': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'following': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'token': {
            'type': Sequelize.STRING(15),
            'allowNull': true
        },
        'hometown': {
            'type': Sequelize.STRING(45),
            'allowNull': true
        },
        'face_url': {
            'type': Sequelize.STRING(45),
            'allowNull': true
        },
        'signature': {
            'type': Sequelize.STRING(125),
            'allowNull': true
        },
        'location': {
            'type': Sequelize.STRING(45),
            'allowNull': true
        },
        'birthday': {
            'type': Sequelize.STRING(45),
            'allowNull': true
        },
        'career': {
            'type': Sequelize.STRING(45),
            'allowNull': true
        },
        'nickname': {
            'type': Sequelize.STRING(45),
            'allowNull': true
        }
    }
);

User.sync();

module.exports = User;
