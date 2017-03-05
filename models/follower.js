/**
 * Created by airing on 2017/3/4.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');

var Follower = sequelize.define(
    'follower',
    {
        'fid': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'tid': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'face_url': {
            'type': Sequelize.STRING(125),
            'allowNull': true
        },
        'signature': {
            'type': Sequelize.STRING(125),
            'allowNull': true
        },
        'nickname': {
            'type': Sequelize.STRING(125),
            'allowNull': true
        }
    },
    {
        indexes: [
            {
                name: 'follower_to_userid',
                method: 'BTREE',
                fields: ['tid']
            }
        ]
    }
);

Follower.sync();

module.exports = Follower;