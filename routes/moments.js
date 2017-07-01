var express = require('express');
var router = express.Router();
var UserModel = require('../models').User;
var MomentModel = require('../models').Moment;
var CommentModel = require('../models').Comment;
var ThumbsupModel = require('../models').Thumbsup;
var CollectionModel = require('../models').Collection;
var FollowerModel = require('../models').Follower;

var KEY = require('./config').KEY;
var MESSAGE = require('./config').MESSAGE;
var LantitudeLongitudeDist = require('./config').LantitudeLongitudeDist;

router.post('/post_moment', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.type == undefined || req.body.type == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.msg == undefined || req.body.msg == ''
        || req.body.longitude == undefined || req.body.longitude == ''
        || req.body.latitude == undefined || req.body.latitude == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var momentData = {};
    var moment_location = req.body.moment_location || '';

    // 纯文本
    if (req.body.type == 0) {

        UserModel.findOne({
            include: [MomentModel],
            where: {
                id: req.body.uid
            }
        }).then(function (user) {
            var moment = {
                msg: req.body.msg,
                type: 0,
                userId: user.id,
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude),
                moment_location: moment_location,
                cover: 'null',
                video: 'null',
                thumbs: 'null',
                pictures: 'null',
                createdAt: timestamp,
                updatedAt: timestamp
            }
            console.log(moment);
            MomentModel.create(moment).then(function() {
                momentData.mid = moment.id;
                momentData.msg = moment.msg;
                momentData.uid = moment.userId;
                momentData.type = 0;  
                res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData})
                return;
            })
        }).catch(next);
    }

    // 图片
    if (req.body.type == 1) {
        if (req.body.pictures == undefined || req.body.pictures == '') {
            return res.json({status: 1002, msg: MESSAGE.PICTURE_IS_NULL});
        }

        UserModel.findOne({
            include: [MomentModel],
            where: {
                id: req.body.uid
            }
        }).then(function (user) {
            var moment = {
                msg: req.body.msg,
                type: 1,
                userId: user.id,
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude),
                moment_location: req.body.moment_location,
                cover: 'null',
                video: 'null',
                thumbs: 'null',
                pictures: req.body.pictures,
                createdAt: timestamp,
                updatedAt: timestamp
            }
            console.log(moment);
            MomentModel.create(moment).then(function() {
                momentData.mid = moment.id;
                momentData.msg = moment.msg;
                momentData.uid = moment.userId;
                momentData.pictures = moment.pictures;
                momentData.type = 0;  
                res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData})
                return;
            })
        }).catch(next);
    }

    // 视频
    if (req.body.type == 2) {
        if (req.body.video == undefined || req.body.video == '') {
            return res.json({status: 1003, msg: MESSAGE.VIDEO_IS_NULL});
        }

        UserModel.findOne({
            include: [MomentModel],
            where: {
                id: req.body.uid
            }
        }).then(function (user) {
            var moment = {
                msg: req.body.msg,
                type: 1,
                userId: user.id,
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude),
                moment_location: req.body.moment_location,
                cover: 'null',
                video: req.body.video,
                thumbs: 'null',
                pictures: 'null',
                createdAt: timestamp,
                updatedAt: timestamp
            }
            console.log(moment);
            MomentModel.create(moment).then(function() {
                momentData.mid = moment.id;
                momentData.msg = moment.msg;
                momentData.uid = moment.userId;
                momentData.video = moment.video;
                momentData.type = 0;  
                res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData})
                return;
            })
        }).catch(next);
    }
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
        });

        UserModel.findOne({
            where: {
                id: req.body.user_id
            }
        }).then(function(user) {
            var userData = {}
            userData.uid = req.body.user_id;
            userData.birthday = user.birthday;
            userData.career = user.career;
            userData.face_url = user.face_url;
            userData.follower = user.follower;
            userData.following = user.following;
            userData.location = user.location;
            userData.username = user.username;
            userData.school = user.school;
            userData.sex = user.sex;
            userData.signature = user.signature;
            res.json({status: 0, msg: MESSAGE.SUCCESS, data: moments, user: userData});
            return;
        })
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
        updatedAt: timestamp,
        reply_uid: 0,
        reply_username: 'null'
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
            id: req.body.uid
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

router.post('/update_thumbsup', function (req, res, next) {

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
            uid: req.body.uid,
            momentId: req.body.mid
        }
    }).then(function (result) {
        if (result !== null) {
            // 已经点过赞
            ThumbsupModel.destroy({
                where: {
                    userId: req.body.uid,
                    momentId: req.body.mid
                }
            }).then(function() {
                res.json({status: 0, msg: MESSAGE.SUCCESS});
                return;
            })
        } else {
            // 没有点过赞
            var thumbsup = {
                uid: req.body.uid,
                momentId: req.body.mid,
                username: '',
                createdAt: timestamp,
                updatedAt: timestamp,
                face_url: '',
                signature: '',
                user: {},
                moment: {}
            };

            UserModel.findOne({
                where: {
                    id: req.body.uid
                }
            }).then(function (user) {
                thumbsup.username = user.username;
                thumbsup.face_url = user.face_url;
                thumbsup.signature = user.signature;
                thumbsup.user = user;
                MomentModel.findOne({
                    where: {
                        id: req.body.mid
                    }
                }).then(function(moment) {
                    thumbsup.moment = moment;
                    ThumbsupModel.create(thumbsup).then(function (result) {
                        var data = {};
                        data.thumbs_up_id = result.id;
                        data.username = result.username;
                        data.uid = result.userId;
                        data.created_at = result.createdAt;
                        res.json({status: 0, data: data});
                    })
                })
                
                
            }).catch(next);
        }
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
            uid: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0, msg: MESSAGE.SUCCESS})
    }).catch(next)

    return;
});

// WARNING: 即将废弃的接口
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
        console.log(result)
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

        result.forEach(function(d) {
            var moment = {
                user: {}
            };
            moment.distance_string = LantitudeLongitudeDist(req.body.longitude, req.body.latitude, d.longitude, d.latitude);
            moment.type = d.type;
            moment.moment_location = d.moment_location;
            moment.cover = d.cover;
            moment.mid = d.id;
            moment.pictures = d.pictures;
            moment.created_at = d.createdAt;
            moment.msg = d.msg;
            moment.video = d.video;
            moment.comment = d.t_comments;
            moment.thumbs_up = d.t_thumbs_ups;

            UserModel.findOne({
                where: {
                    id: d.userId
                }
            }).then(function(user) {
                moment.user.uid = user.id;
                moment.user.username = user.username;
                moment.user.sex = user.sex;
                // moment.user.is_followed = 
                moment.user.face_url = user.face_url;
                if (i >= startRow && i <= endRow) {
                    moments.push(moment);
                    i++;
                }
            }).catch(next);
        })
        setTimeout(function() {
            res.json({status: 0, data: moments, msg: MESSAGE.SUCCESS});
            return;
        }, 1000)
    }).catch(next);
    
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
        include: [UserModel],
        where: {
            id: req.body.mid,
        }
    }).then(function (moment) {
        console.log(moment);
        UserModel.findOne({
            where: {
                id: req.body.uid
            }
        }).then(function(user) {
            var collection = {
                first_picture: moment.pictures.split(',')[0],
                username: user.username,
                msg: moment.msg,
                type: moment.type,
                face_url: user.face_url,
                userId: req.body.uid,
                momentId: req.body.mid
            }
            CollectionModel.create(collection).then(function() {
                var data = {
                    first_picture: moment.pictures.split(',')[0],
                    username: user.username,
                    msg: moment.msg,
                    type: moment.type,
                    face_url: user.face_url,
                    create_at: new Date().getTime(),
                    mid: moment.id,
                    uid: user.id
                }
                res.json({status: 0, data: data, msg: MESSAGE.SUCCESS})
            })
        })       
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
                face_url: d.face_url,
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
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.longitude == undefined || req.body.longitude == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findOne({
        include: [UserModel, CommentModel, ThumbsupModel],
        where: {
            id: req.body.mid,
        }
    }).then(function (result) {
        var moment = {
            user: {},
        };
        moment.distance_string = LantitudeLongitudeDist(req.body.longitude, req.body.latitude, result.longitude, result.latitude);
        moment.type = result.type;
        moment.moment_location = result.moment_location;
        moment.cover = result.cover;
        moment.mid = result.id;
        moment.pictures = result.pictures;
        moment.created_at = result.createdAt;
        moment.msg = result.msg;
        moment.video = result.video;
        moment.comment = result.t_comments;
        moment.thumbs_up = result.t_thumbs_ups;

        UserModel.findOne({
            where: {
                id: result.userId
            }
        }).then(function(user) {
            moment.user.uid = user.id;
            moment.user.username = user.username;
            moment.user.sex = user.sex;
            moment.user.is_followed = 0;
            moment.user.face_url = user.face_url;
            FollowerModel.findOne({
                where: {
                    fid: req.body.uid,
                    tid: user.id
                }
            }).then(function(result) {
                if (result) {
                    moment.user.is_followed = 1;
                }
                res.json({status: 0, data: moment, msg: MESSAGE.SUCCESS})
            })
        });
    }).catch(next);
    return;
});

module.exports = router;
