/**
 * Created by airing on 2017/3/4.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'invitation',
        {
            'uid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'code': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'used': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            }
        }
    );
}