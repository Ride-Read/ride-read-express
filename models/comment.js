/**
 * Created by airing on 2017/3/4.
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_comment',
        {
            'uid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'userId': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            },
            'username': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'momentId': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'msg': {
                'type': DataTypes.TEXT,
                'allowNull': false
            },
            'face_url': {
                'type': DataTypes.STRING(125),
                'allowNull': false
            },
            'reply_uid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'reply_username': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'createdAt': {
                'type': DataTypes.DOUBLE,
                'allowNull': true
            },
            'updatedAt': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            }
        },
        {
            indexes: [
            {
                name: 'moment_id',
                method: 'BTREE',
                fields: ['momentId']
            },
            {
                name: 'user_id',
                method: 'BTREE',
                fields: ['userId']
            }
            ]
        }
    );
}

