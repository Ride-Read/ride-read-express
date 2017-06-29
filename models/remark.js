/**
 * Created by airing on 2017/6/29.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_remark',
        {
            'uid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'user_id': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'nickname': {
                'type': DataTypes.STRING(135),
                'allowNull': true
            }
        }
    );
}