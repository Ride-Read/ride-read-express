/**
 * Created by airing on 2017/3/3.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'user',
        {
            'username': {
                'type': DataTypes.STRING(45),
                'allowNull': false
            },
            'password': {
                'type': DataTypes.STRING(125),
                'allowNull': false
            },
            'sex': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            },
            'school': {
                'type': DataTypes.STRING(45),
                'allowNull': true
            },
            'phonenumber': {
                'type': DataTypes.STRING(20),
                'allowNull': true
            },
            'follower': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            },
            'following': {
                'type': DataTypes.INTEGER,
                'allowNull': true
            },
            'token': {
                'type': DataTypes.STRING(125),
                'allowNull': true
            },
            'hometown': {
                'type': DataTypes.STRING(45),
                'allowNull': true
            },
            'face_url': {
                'type': DataTypes.STRING(45),
                'allowNull': true
            },
            'signature': {
                'type': DataTypes.STRING(125),
                'allowNull': true
            },
            'location': {
                'type': DataTypes.STRING(45),
                'allowNull': true
            },
            'birthday': {
                'type': DataTypes.STRING(45),
                'allowNull': true
            },
            'career': {
                'type': DataTypes.STRING(45),
                'allowNull': true
            },
            'nickname': {
                'type': DataTypes.STRING(45),
                'allowNull': true
            },
            'tags': {
                'type': DataTypes.TEXT,
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
        }
    );
}
