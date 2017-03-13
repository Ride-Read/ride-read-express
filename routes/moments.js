var express = require('express');
var router = express.Router();
var UserModel = require('../models').User;
var MomentModel = require('../models').Moment;
var CommentModel = require('../models').Comment;
var ThumbsupModel = require('../models').Thumbsup;

var KEY = 'airing';

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
        strHours = "0" + strHours;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }
    if (strSeconds >= 0 && strSeconds <= 9) {
        strSeconds = "0" + strSeconds;
    }
    var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + 'T' + strHours + seperator2 + strMinutes
        + seperator2 + strSeconds + '.000Z';
    return currentDate;
}

router.post('/post_moment', function (req, res, next) {

    if (req.body.type == undefined || req.body.type == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.msg == undefined || req.body.msg == '') {

        return res.json({status: 1});
    }

    console.log('POST: moments/post_moment');
    console.log('TIME: ' + getNowFormatDate());
    console.log('uid: ' + req.body.uid);
    console.log('token: ' + req.body.token);
    console.log('timestamp: ' + req.body.timestamp);
    console.log('type: ' + req.body.type);
    console.log('msg: ' + req.body.msg);

    var momentData = {};

    // 纯文本
    if (req.body.type == 0) {


        var moment = {
            msg: req.body.msg,
            type: 0
        }

        UserModel.findOne({
            where: {
                id: req.body.uid
            }
        }).then(function (user) {
            user.createMoment(moment);
            momentData.mid = moment.id;
            momentData.msg = moment.msg;
            momentData.uid = moment.userId;
            momentData.type = 0;   
            res.json({status: 1, data: momentData})
        }).catch(next);

        return;
    }

    // 图片
    if (req.body.type == 1) {

        if (req.body.pictures == undefined || req.body.pictures == '') {
            return res.json({status: 1002});
        }

        var moment = {
            msg: req.body.msg,
            pictures: req.body.pictures,
            type: 1
        }

        UserModel.findOne({
            where: {
                id: req.body.uid
            }
        }).then(function (user) {
            user.createMoment(moment);
            momentData.mid = moment.id;
            momentData.msg = moment.msg;
            momentData.uid = moment.userId;
            momentData.pictures = moment.pictures;
            momentData.type = 1;   
            res.json({status: 1, data: momentData})
        }).catch(next);

        return;
    }

    // 视频
    if (req.body.type == 2) {

        if (req.body.video == undefined || req.body.video == '') {
            return res.json({status: 1003});
        }

        var moment = {
            msg: req.body.msg,
            video: req.body.video,
            type: 2
        }

        UserModel.findOne({
            where: {
                id: req.body.uid
            }
        }).then(function (user) {
            user.createMoment(moment);
            momentData.mid = moment.id;
            momentData.msg = moment.msg;
            momentData.uid = moment.uid;
            momentData.video = moment.video;
            momentData.type = 2;   
            res.json({status: 1, data: momentData})
        }).catch(next);

        return;
    }

    return res.json({status: 1001});

});

router.post('/show_moment', function (req, res, next) {

    if (req.body.pages == undefined || req.body.pages == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.user_id == undefined || req.body.user_id == '') {

        return res.json({status: 1});
    }

    console.log('POST: moments/show_moment');
    console.log('TIME: ' + getNowFormatDate());
    console.log('uid: ' + req.body.uid);
    console.log('token: ' + req.body.token);
    console.log('timestamp: ' + req.body.timestamp);
    console.log('pages: ' + req.body.pages);
    console.log('user_id: ' + req.body.user_id);

    MomentModel.findAll({
        include: [UserModel, CommentModel, ThumbsupModel],
        where: {
            userId: req.body.user_id
        }
    }).then(function (result) {
        
        var totalPages = 0;
        var pageSize = 10;
        var num = result.length;

        if (num / pageSize > parseInt(num / pageSize)) {
            totalPages = parseInt(num / pageSize) + 1;
        } else {
            totalPages = parseInt(num / pageSize);
        }

        var currentPage = req.body.pages;
        var startRow = (currentPage - 1) * pageSize;
        var endRow = currentPage * pageSize;
        endRow = (endRow > num) ? num : endRow;

        var moments = [];
        var user = {};
        var i = 0;

        result.forEach(function (moment) {
            var momentData = {};
            momentData.mid = moment.id;
            momentData.msg = moment.msg;
            momentData.pictures = moment.pictures;
            momentData.video = moment.video;
            momentData.created_at = moment.createdAt;
            momentData.comments = moment.comments;
            momentData.thumbsups = moment.thumbsups;

            if (i >= startRow && i <= endRow) {
                moments.push(momentData);
            }
            i++;

            user.uid = moment.user.id;
            user.birthday = moment.user.birthday;
            user.career = moment.user.career;
            user.face_url = moment.user.face_url;
            user.follower = moment.user.follower;
            user.following = moment.user.following;
            user.location = moment.user.location;
            user.nickname = moment.user.nickname;
            user.school = moment.user.school;
            user.sex = moment.user.sex;
            user.signature = moment.user.signature;
        });

        res.json({status: 0, data: moments, user: user});

    }).catch(next);

    return;

});

router.post('/add_comment', function (req, res, next) {

    if (req.body.msg == undefined || req.body.msg == ''
        || req.body.mid == undefined || req.body.mid == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == '') {

        return res.json({status: 1});
    }

    console.log('POST: moments/add_comment');
    console.log('TIME: ' + getNowFormatDate());
    console.log('uid: ' + req.body.uid);
    console.log('token: ' + req.body.token);
    console.log('timestamp: ' + req.body.timestamp);
    console.log('msg: ' + req.body.msg);
    console.log('mid: ' + req.body.mid);

    var comment = {
        userId: req.body.uid,
        momentId: req.body.mid,
        nickname: '',
        face_url: '',
        msg: req.body.msg,
        moment: {},
        user: {}
    };

    UserModel.findOne({
        where: {
            id: req.body.mid
        }
    }).then(function (user) {
        comment.user = user;
        comment.nickname = user.nickname;
        comment.face_url = user.face_url;

        MomentModel.findOne({
            where: {
                id: req.body.mid
            }
        }).then(function (moment) {
            comment.moment = moment;
        }).catch(next);

        CommentModel.create(comment).then(function (result) {
            var data = {};
            data.comment_id = result.id;
            data.face_url = result.face_url;
            data.msg = result.msg;
            data.nickname = result.nickname;
            data.uid = result.userId;
            data.created_at = result.createdAt;
            res.json({status: 0, data: data});
        }).catch(next);
    }).catch(next);
    
    return;

});

router.post('/add_thumbsup', function (req, res, next) {

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1});
    }

    console.log('POST: moments/add_thumbsup');
    console.log('TIME: ' + getNowFormatDate());
    console.log('uid: ' + req.body.uid);
    console.log('token: ' + req.body.token);
    console.log('timestamp: ' + req.body.timestamp);
    console.log('mid: ' + req.body.mid);

    // 判断是否已经点过赞
    ThumbsupModel.findOne({
        where: {
            userId: req.body.uid,
            momentId: req.body.mid
        }
    }).then(function (result) {
        if (result != null) return res.json({status: 1000});
    }).catch(next);

    var thumbsup = {
        userId: req.body.uid,
        momentId: req.body.mid,
        nickname: '',
        moment: {},
        user: {}
    };

    UserModel.findOne({
        where: {
            id: req.body.uid
        }
    }).then(function (user) {
        thumbsup.nickname = user.nickname;
        thumbsup.user = user;

        MomentModel.findOne({
            where: {
                id: req.body.mid
            }
        }).then(function (moment) {
            thumbsup.moment = moment;
        }).catch(next);

        ThumbsupModel.create(thumbsup).then(function (result) {
            var data = {};
            data.thumbs_up_id = result.id;
            data.nickname = result.nickname;
            data.uid = result.userId;
            data.created_at = result.createdAt;
            res.json({status: 0, data: data});
        }).catch(next);
    }).catch(next);
    
    return;

});

router.post('/remove_comment', function (req, res, next) {

    if (req.body.comment_id == undefined || req.body.comment_id == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == '') {

        return res.json({status: 1});
    }

    console.log('POST: moments/remove_comment');
    console.log('TIME: ' + getNowFormatDate());
    console.log('uid: ' + req.body.uid);
    console.log('token: ' + req.body.token);
    console.log('timestamp: ' + req.body.timestamp);
    console.log('comment_id: ' + req.body.comment_id);

    CommentModel.destroy({
        where: {
            id: req.body.comment_id,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0})
    }).catch(next)

    return;
});

router.post('/remove_thumbsup', function (req, res, next) {

    if (req.body.thumbs_up_id == undefined || req.body.thumbs_up_id == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1});
    }

    console.log('POST: moments/remove_thumbsup');
    console.log('TIME: ' + getNowFormatDate());
    console.log('uid: ' + req.body.uid);
    console.log('token: ' + req.body.token);
    console.log('timestamp: ' + req.body.timestamp);
    console.log('thumbs_up_id: ' + req.body.thumbs_up_id);

    ThumbsupModel.destroy({
        where: {
            id: req.body.thumbs_up_id,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0})
    }).catch(next)

    return;
});

router.post('/remove_moment', function (req, res, next) {

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1});
    }

    console.log('POST: moments/remove_moment');
    console.log('TIME: ' + getNowFormatDate());
    console.log('uid: ' + req.body.uid);
    console.log('token: ' + req.body.token);
    console.log('timestamp: ' + req.body.timestamp);
    console.log('mid: ' + req.body.mid);

    MomentModel.destroy({
        where: {
            id: req.body.mid,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0})
    }).catch(next)

    return;
});

module.exports = router;
