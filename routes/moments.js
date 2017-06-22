var express = require('express');
var router = express.Router();
var UserModel = require('../models').User;
var MomentModel = require('../models').Moment;
var CommentModel = require('../models').Comment;
var ThumbsupModel = require('../models').Thumbsup;
var CollectionModel = require('../models').Collection;

var KEY = require('.config').KEY;
var MESSAGE = require('.config').MESSAGE;
var LantitudeLongitudeDist = require('.config').LantitudeLongitudeDist;

router.post('/post_moment', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.type == undefined || req.body.type == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.msg == undefined || req.body.msg == ''
        || req.body.longitude == undefined || req.body.longitude == ''
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.moment_location == undefined || req.body.moment_location == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var momentData = {};

    // 纯文本
    if (req.body.type == 0) {
        var moment = {
            msg: req.body.msg,
            type: 0,
            createdAt: timestamp,
            updatedAt: timestamp,
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
            res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData})
            return;
        }).catch(next);
    }

    // 图片
    if (req.body.type == 1) {
        if (req.body.pictures == undefined || req.body.pictures == '') {
            return res.json({status: 1002, msg: MESSAGE.PICTURE_IS_NULL});
        }
        var moment = {
            msg: req.body.msg,
            pictures: req.body.pictures,
            type: 1,
            createdAt: timestamp,
            updatedAt: timestamp,
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
            res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData})
            return;
        }).catch(next);
    }

    // 视频
    if (req.body.type == 2) {
        if (req.body.video == undefined || req.body.video == '') {
            return res.json({status: 1003, msg: MESSAGE.VIDEO_IS_NULL});
        }
        var moment = {
            msg: req.body.msg,
            video: req.body.video,
            type: 2,
            createdAt: timestamp,
            updatedAt: timestamp,
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
            res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData})
            return;
        }).catch(next);
    }
    return res.json({status: 1001, msg: MESSAGE.TYPE_ERROR});
});

router.post('/show_user', function (req, res, next) {

    if (req.body.pages == undefined || req.body.pages == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.longitude == undefined || req.body.longitude == ''
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.user_id == undefined || req.body.user_id == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
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
            momentData.thumbs_up = moment.thumbsups;

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
            user.username = moment.user.username;
            user.school = moment.user.school;
            user.sex = moment.user.sex;
            user.signature = moment.user.signature;
        });

        res.json({status: 0, msg: MESSAGE.SUCCESS, data: moments, user: user});
    }).catch(next);

    return;
});

router.post('/add_comment', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.msg == undefined || req.body.msg == ''
        || req.body.mid == undefined || req.body.mid == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var comment = {
        uid: req.body.uid,
        momentId: req.body.mid,
        username: '',
        face_url: '',
        msg: req.body.msg,
        moment: {},
        user: {},
        createdAt: timestamp,
        updatedAt: timestamp
    };

    if (req.body.reply_uid !== undefined && req.body.reply_uid !== '') {
        comment = {
            uid: req.body.uid,
            momentId: req.body.mid,
            username: '',
            face_url: '',
            msg: req.body.msg,
            moment: {},
            user: {},
            createdAt: timestamp,
            updatedAt: timestamp,
            reply_uid: req.body.reply_uid,
            reply_username: req.body.reply_username
        }
    }

    UserModel.findOne({
        where: {
            id: req.body.mid
        }
    }).then(function (user) {
        comment.user = user;
        comment.username = user.username;
        comment.face_url = user.face_url;

        MomentModel.findOne({
            where: {
                id: req.body.mid
            }
        }).then(function (moment) {
            comment.moment = moment;
            CommentModel.create(comment).then(function (result) {
                var data = {};
                data.comment_id = result.id;
                data.face_url = result.face_url;
                data.msg = result.msg;
                data.username = result.username;
                data.uid = result.uid;
                data.created_at = result.createdAt;
                res.json({status: 0, data: data, msg: MESSAGE.SUCCESS});
            }).catch(next);
        }).catch(next);
    }).catch(next);
    
    return;

});

router.post('/add_thumbsup', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
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
        user: {},
        createdAt: timestamp,
        updatedAt: timestamp
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

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    CommentModel.destroy({
        where: {
            id: req.body.comment_id,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

router.post('/remove_thumbsup', function (req, res, next) {

    if (req.body.thumbs_up_id == undefined || req.body.thumbs_up_id == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    ThumbsupModel.destroy({
        where: {
            id: req.body.thumbs_up_id,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

router.post('/remove_moment', function (req, res, next) {

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.destroy({
        where: {
            id: req.body.mid,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

router.post('/show_thumbsup', function (req, res, next) {

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.pages == undefined || req.body.pages == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    ThumbsupModel.findAll({
        where: {
            momentId: req.body.mid
        }
    }).then(function(result) {
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
        var i = 0;
        var thumbsups = [];
        result.forEach(function(d) {
            var thumbsup = {}
            thumbsup.uid = d.userId;
            // 是否必须需要 ？ thumbsup.is_followed = 
            thumbsup.signature = d.signature;
            thumbsup.username = d.username;
            thumbsup.face_url = d.face_url;
            if (i >= startRow && i <= endRow) {
                thumbsups.push(thumbsup);
            }
            i++;
        });
        res.json({status: 0, msg: MESSAGE.SUCCESS, data: thumbsups})
        return;
    }).catch(next);
});

router.post('/show_moment', function (req, res, next) {

    if (req.body.pages == undefined || req.body.pages == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.longitude == undefined || req.body.longitude == ''
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.type == undefined || req.body.type == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        include: [UserModel, CommentModel, ThumbsupModel],
    }).then(function(result) {
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
        var i = 0;

        result.forEach(function(item) {
            var moment = {
                user: {},
                comment: {},
                thumbs_up: {}
            };
            moment.distance_string = LantitudeLongitudeDist(req.body.longitude, req.body.lantitude, d.longitude, d.lantitude);
            moment.type = d.type;
            moment.moment_location = d.moment_location;
            moment.cover = d.cover;
            moment.mid = d.id;
            moment.pictures = d.pictures;
            moment.created_at = d.createdAt;
            moment.msg = d.msg;
            moment.video = d.video;
            moment.user.uid = d.user.id;
            moment.user.username = d.user.username;
            moment.user.sex = d.user.sex;
            // moment.user.is_followed = 
            moment.user.face_url = d.user.face_url;
            moment.comment.comment_id = d.comment.id;
            moment.comment.reply_username = d.comment.reply_username;
            moment.comment.created_at = d.comment.createdAt;
            moment.comment.face_url = d.comment.face_url;
            moment.comment.username = d.comment.username;
            moment.comment.uid = d.comment.userId;
            moment.comment.reply_uid = d.comment.reply_uid;
            moment.comment.msg = d.comment.msg;
            moment.thumbs_up.thumbs_up_id = d.thumbsup.id;
            moment.thumbs_up.username = d.thumbsup.username;
            moment.thumbs_up.created_at = d.thumbsup.createdAt;
            moment.thumbs_up.uid = d.thumbsup.userId;

            if (i >= startRow && i <= endRow) {
                moments.push(moment);
            }
            i++;
        })

        res.json({status: 0, data: moments, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

router.post('/collect_moment', function (req, res, next) {

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.type == undefined || req.body.type == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findOne({
        include: [UserModel]
        where: {
            id: req.body.mid,
        }
    }).then(function (moment) {
        var user = moment.user;
        var collection = {
            first_picture: moment.pictures.split(',')[0],
            username: moment.user.username,
            msg: moment.msg,
            type: moment.type,
            face_url: moment.user.face_url,
        }
        user.createCollection(collection);
        var data = {
            first_picture: moment.pictures.split(',')[0],
            username: moment.user.username,
            msg: moment.msg,
            type: moment.type,
            face_url: moment.user.face_url,
            create_at: new Date().getTime(),
            mid: moment.id,
            uid: user.id
        }
        res.json({status: 0, data: data, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

router.post('/show_collect_moment', function (req, res, next) {

    if (req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    CollectionModel.findAll({
        where: {
            userId: req.body.uid,
        }
    }).then(function (result) {
        var collections = [];
        result.forEach(function(d) {
            var data = {
                first_picture: d.first_picture,
                username: d.username,
                msg: d.msg,
                type: d.type,
                face_url: d.user.face_url,
                create_at: d.createdAt,
                mid: d.momentId,
                uid: d.userId
            }
            collections.push(data);
        })
        res.json({status: 0, data: collections, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

router.post('/show_one_moment', function (req, res, next) {

    if (req.body.mid == undefined || req.body.mid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.lantitude == undefined || req.body.lantitude == ''
        || req.body.longitude == undefined || req.body.longitude == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findOne({
        where: {
            id: req.body.mid,
        }
    }).then(function (result) {
        res.json({status: 0, data: result, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

module.exports = router;
