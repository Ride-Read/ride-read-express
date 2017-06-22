/**
 * Created by airing on 2017/6/22.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_version_number',
        {
            'version_type': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            },
            'version': {
                'type': DataTypes.STRING(40),
                'allowNull': true
            },
            'version_url': {
                'type': DataTypes.STRING(120),
                'allowNull': true
            }
        }
    );
}