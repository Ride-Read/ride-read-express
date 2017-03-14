/**
 * Created by airing on 2017/3/4.
 */
module.exports = function (sequelize, DataTypes) {

    return sequelize.define(
        'following',
        {
            'fid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'tid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'face_url': {
                'type': DataTypes.STRING(125),
                'allowNull': true
            },
            'signature': {
                'type': DataTypes.STRING(125),
                'allowNull': true
            },
            'nickname': {
                'type': DataTypes.STRING(125),
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
                    name: 'following_from_userid',
                    method: 'BTREE',
                    fields: ['fid']
                }
            ]
        }
    );
}