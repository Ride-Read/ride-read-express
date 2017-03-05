/**
 * Created by airing on 2017/3/4.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');

var Following = sequelize.define(
    'following',
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
                name: 'following_from_userid',
                method: 'BTREE',
                fields: ['fid']
            }
        ]
    }
);

Following.sync();

module.exports = Following;