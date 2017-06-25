/**
 * Created by airing on 2017/3/4.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        't_follow',
        {
            'fid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'tid': {
                'type': DataTypes.INTEGER,
                'allowNull': false
            },
            'f_username': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            't_username': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'f_signature': {
                'type': DataTypes.STRING(245),
                'allowNull': false
            },
            't_signature': {
                'type': DataTypes.STRING(245),
                'allowNull': false
            },
            'f_face_url': {
                'type': DataTypes.STRING(145),
                'allowNull': false
            },
            't_face_url': {
                'type': DataTypes.STRING(145),
                'allowNull': false
            },
            'createdAt': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            },
            'updatedAt': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            }
        }
    );
}