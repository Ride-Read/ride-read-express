module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_dating',
        {
            'uid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'sex': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'dating_time': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'dating_sex': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'dating_mode': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'dating_begin': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'dating_end': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'dating_over': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            }
        }
    );
}