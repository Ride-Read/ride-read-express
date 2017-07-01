/**
 * Created by airing on 2017/7/1.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_points',
        {
            'userId': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'latitude': {
                'type': DataTypes.DOUBLE,
                'allowNull': false
            },
            'longitude': {
                'type': DataTypes.DOUBLE,
                'allowNull': false
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