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

    // TODO: 点赞数据与评论数据

    if (req.body.pages == undefined || req.body.pages == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.user_id == undefined || req.body.user_id == '') {

        return res.json({status: 1});
    }

    MomentModel.findAll({
        include: [UserModel],
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


});

router.post('/add_thumbsup', function (req, res, next) {

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1});
    }

    // TODO: 判断是否已经点过赞

    var thumbsup = {
        userId: req.body.uid,
        momentId: req.body.mid,
        nickname: '',
        moment: {},
        user: {}
    };
    
    UserModel.findOne({
        where: {
            id: req.body.mid
        }
    }).then(function (user) {
        thumbsup.user = user;
        thumbsup.nickname = user.nickname;

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

    if (req.body.commeng_id == undefined || req.body.commeng_id == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == '') {

        return res.json({status: 1});
    }


});

router.post('/remove_thumbsup', function (req, res, next) {

    if (req.body.thumbs_up_id == undefined || req.body.thumbs_up_id == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1});
    }
});

module.exports = router;
