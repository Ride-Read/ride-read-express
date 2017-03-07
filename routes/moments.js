var express = require('express');
var router = express.Router();
var UserModel = require('../models').User;
var MomentModel = require('../models').Moment;
var CommentModel = require('../models').Comment;
var ThumbsupModel = require('../models').Thumbsup;

router.post('/post_moment', function (req, res, next) {

    if (req.body.type == undefined || req.body.type == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.msg == undefined || req.body.msg == '') {

        return res.json({status: 1});
    }


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
