/**
 * Created by airing on 2017/3/4.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_last_map',
        {
            'uid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'timestamp': {
                'type': DataTypes.DOUBLE,
                'allowNull': false
            }
        }
    );
}