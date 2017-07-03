/**
 * Created by airing on 2017/3/4.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_unread',
        {
            'uid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'mid': {
            	'type': DataTypes.INTEGER,
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
        }
    );
}
