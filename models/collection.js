/**
 * Created by airing on 2017/3/4.
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_collection',
        {
            'userId': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            },
            'momentId': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'username': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'first_picture': {
                'type': DataTypes.STRING(125),
                'allowNull': false
            },
            'msg': {
                'type': DataTypes.TEXT,
                'allowNull': false
            },
            'type': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'face_url': {
                'type': DataTypes.STRING(125),
                'allowNull': false
            },
            'createdAt': {
                'type': DataTypes.INTEGER,
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

