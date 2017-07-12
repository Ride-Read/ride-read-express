var express = require('express');
var router = express.Router();
var UserModel = require('../models').User;
var MomentModel = require('../models').Moment;
var PointModel = require('../models').Point;
var CommentModel = require('../models').Comment;
var ThumbsupModel = require('../models').Thumbsup;
var CollectionModel = require('../models').Collection;
var FollowerModel = require('../models').Follower;
var UnreadModel = require('../models').Unread;

var KEY = require('./config').KEY;
var MESSAGE = require('./config').MESSAGE;
var LantitudeLongitudeDist = require('./config').LantitudeLongitudeDist;
var JiGuangPush = require('./config').JiGuangPush;

router.post('/post_dating', function (req, res, next) {
	
}