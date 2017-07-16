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
var DatingModel = require('../models').Dating;

var KEY = require('./config').KEY;
var MESSAGE = require('./config').MESSAGE;
var LantitudeLongitudeDist = require('./config').LantitudeLongitudeDist;
var JiGuangPush = require('./config').JiGuangPush;

router.post('/post_dating', function (req, res, next) {
	if (req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.dating_time == null || req.body.dating_sex == null || req.body.dating_mode == null || req.body.dating_begin == null || req.body.dating_end == null || req.body.user_sex == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var dating = {
    	uid: req.body.uid,
    	dating_time: req.body.dating_time,
    	dating_sex: req.body.dating_sex,
    	dating_mode: req.body.dating_mode,
    	dating_begin: req.body.dating_begin,
    	dating_end: req.body.dating_end,
    	dating_over: 0,
    	sex: req.body.user_sex
    }

    var target_sex = 3
    if (dating_sex == 1) {
    	target_sex = 2
    } else if (dating_sex == 2) {
    	target_sex = 1
    }

	DatingModel.findAll({
		where: {
			dating_time: dating.dating_time,
			dating_mode: dating.dating_mode,
			dating_begin: dating.dating_begin,
			dating_end: req.body.dating_end,
			sex: target_sex
		}
	}).then(function(result) {
		var uids = []
		if (result.length > 0) {
			result.forEach(function(d) {
				uids.push(d.uid);
			})
		}
		return res.json({status: 0, data: uids, msg: MESSAGE.SUCCESS});
	});
});

module.exports = router;