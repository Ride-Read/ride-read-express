/**
 * Created by airing on 2017/3/4.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_sms_code',
        {
            'phonenumber': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'rand_code': {
                'type': DataTypes.STRING(20),
                'allowNull': false
            },
            'timestamp': {
                'type': DataTypes.STRING(135),
                'allowNull': false
            },
            'used': {
                'type': DataTypes.BOOLEAN,
                'allowNull': false
            }
        }
    );
}