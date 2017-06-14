var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize').sequelize();
var User = sequelize.import('./user');
var Follower = sequelize.import('./follower');
var Moment = sequelize.import('./moment');
var Thumbsup = sequelize.import('./thumbsup');
var Comment = sequelize.import('./comment');
var SmsCode = sequelize.import('./sms_code');


User.hasMany(Moment, {foreignKey: 'userId', targetKey: 'userId'});
User.hasMany(Thumbsup, {foreignKey: 'userId', targetKey: 'userId'});
User.hasMany(Comment, {foreignKey: 'userId', targetKey: 'userId'});

Moment.hasMany(Comment, {foreignKey: 'momentId', targetKey: 'momentId'});
Moment.hasMany(Thumbsup, {foreignKey: 'momentId', targetKey: 'momentId'});

Moment.belongsTo(User);
Thumbsup.belongsTo(Moment);
Comment.belongsTo(Moment);

sequelize.sync();

exports.User = User;
exports.Follower = Follower;
exports.Moment = Moment;
exports.Thumbsup = Thumbsup;
exports.Comment = Comment;
exports.SmsCode = SmsCode;
