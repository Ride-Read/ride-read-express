/**
 * Created by airing on 2017/3/4.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'moment',
        {
            'userId': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'type': {
            	'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'cover': {
            	'type': DataTypes.STRING(125),
                'allowNull': true
            },
            'msg': {
            	'type': DataTypes.TEXT,
                'allowNull': true
            },
            'video': {
            	'type': DataTypes.STRING(125),
                'allowNull': true
            },
            'thumbs': {
            	'type': DataTypes.TEXT,
                'allowNull': true
            },
            'pictures': {
            	'type': DataTypes.TEXT,
                'allowNull': true
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
                    name: 'user_id',
                    method: 'BTREE',
                    fields: ['userId']
                }
            ]
        }
    );
}
