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

router.post('/post_moment', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.type == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.msg == null || req.body.longitude == null || req.body.latitude == null) {
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
                cover: '',
                video: '',
                thumbs: '',
                pictures: '',
                hot: timestamp,
                createdAt: timestamp
            };
            console.log(moment);
            MomentModel.create(moment).then(function(moment) {
                momentData.mid = moment.id;
                momentData.msg = moment.msg;
                momentData.uid = moment.userId;
                momentData.type = 0;
                return res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData})
            })
        }).catch(next);
    }

    // 图片
    if (req.body.type == 1) {
        if (req.body.pictures == null) {
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
                cover: '',
                video: '',
                thumbs: '',
                pictures: req.body.pictures,
                hot: timestamp,
                createdAt: timestamp
            };
            console.log(moment);
            MomentModel.create(moment).then(function(moment) {
                momentData.mid = moment.id;
                momentData.msg = moment.msg;
                momentData.uid = moment.userId;
                momentData.pictures = moment.pictures;
                momentData.type = 1;
                return res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData});
            })
        }).catch(next);
    }

    // 视频 or 语音
    if (req.body.type == 2 || req.body.type == 3) {
        if (req.body.video == null || req.body.voice_time == null) {
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
                type: req.body.type,
                userId: user.id,
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude),
                moment_location: req.body.moment_location,
                cover: '',
                video: req.body.video,
                voice_time: req.body.voice_time,
                thumbs: '',
                pictures: '',
                hot: timestamp,
                createdAt: timestamp
            };
            if(req.body.cover !== '' && req.body.cover !== undefined) {
                moment.cover = req.body.cover
            }
            MomentModel.create(moment).then(function(moment) {
                momentData.mid = moment.id;
                momentData.msg = moment.msg;
                momentData.uid = moment.userId;
                momentData.video = moment.video;
                momentData.voice_time = moment.voice_time;
                momentData.type = moment.type;  
                momentData.cover = moment.cover;
                return res.json({status: 0, msg: MESSAGE.SUCCESS, data: momentData});
            })
        }).catch(next);
    }
});

router.post('/show_user', function (req, res, next) {

    if (req.body.pages == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.longitude == null || req.body.latitude == null || req.body.user_id == null) {
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
                moment.user.face_url = user.face_url;
                if (i >= startRow && i <= endRow) {
                    moments.push(moment);
                    i++;
                }
            }).catch(next);
        });
        setTimeout(function() {
            return res.json({status: 0, data: moments, msg: MESSAGE.SUCCESS});
        }, 1000)
    }).catch(next);
});

router.post('/add_comment', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.msg == null || req.body.mid == null || req.body.token == null || req.body.uid == null || req.body.timestamp == null || req.body.user_id == null) {
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
        reply_username: ''
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
                data.reply_uid = result.reply_uid;
                data.reply_username = result.reply_username;

                MomentModel.findOne({
                    where: {
                        id: req.body.mid
                    }
                }).then(function(result) {
                    var hot = result.hot + 36000000; // 10小时
                    MomentModel.update({
                        hot: hot
                    }, {
                        where: {
                            id: req.body.mid
                        }
                    }).then(function() {
                        var unread = {
                            uid: req.body.user_id,
                            mid: req.body.mid,
                            createdAt: timestamp
                        };

                        UnreadModel.create(unread).then(function() {
                            JiGuangPush(req.body.user_id);

                            return res.json({status: 0, data: data, msg: MESSAGE.SUCCESS});
                        })
                    })
                })
            }).catch(next);
        }).catch(next);
    }).catch(next);
});

router.post('/update_thumbsup', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.mid == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.user_id == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    // 判断是否已经点过赞
    ThumbsupModel.findOne({
        where: {
            uid: req.body.uid,
            momentId: req.body.mid
        }
    }).then(function (result) {
        if (result) {
            // 已经点过赞
            ThumbsupModel.destroy({
                where: {
                    userId: req.body.uid,
                    momentId: req.body.mid
                }
            }).then(function() {
                ThumbsupModel.findOne({
                    where: {
                        momentId: req.body.mid
                    }
                }).then(function(result) {
                    return res.json({status: 0,data: result, msg: MESSAGE.SUCCESS});
                });
            });
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
                    var hot = moment.hot + 36000000; // 10小时
                    MomentModel.update({
                        hot: hot
                    }, {
                        where: {
                            id: req.body.mid
                        }
                    }).then(function() {
                        ThumbsupModel.create(thumbsup).then(function (result) {
                            var data = {};
                            data.thumbs_up_id = result.id;
                            data.username = result.username;
                            data.uid = result.userId;
                            data.created_at = result.createdAt;
                            var unread = {
                                uid: req.body.user_id,
                                mid: req.body.mid,
                                createdAt: timestamp
                            };
                            UnreadModel.create(unread).then(function() {
                                JiGuangPush(req.body.user_id);
                                return res.json({status: 0, msg: MESSAGE.SUCCESS, data: data});
                            })  
                        })
                    })
                    
                })
            }).catch(next);
        }
    }).catch(next);
});

router.post('/remove_comment', function (req, res, next) {

    if (req.body.comment_id == null || req.body.token == null || req.body.uid == null || req.body.timestamp == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    CommentModel.destroy({
        where: {
            id: req.body.comment_id,
            uid: req.body.uid
        }
    }).then(function () {
        res.json({status: 0, msg: MESSAGE.SUCCESS})
    }).catch(next);
});

// WARNING: 即将废弃的接口
router.post('/remove_thumbsup', function (req, res, next) {

    if (req.body.thumbs_up_id == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    ThumbsupModel.destroy({
        where: {
            id: req.body.thumbs_up_id,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0, msg: MESSAGE.SUCCESS})
    }).catch(next);
});

router.post('/remove_moment', function (req, res, next) {

    if (req.body.mid == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.destroy({
        where: {
            id: req.body.mid,
            userId: req.body.uid
        }
    }).then(function (result) {
        res.json({status: 0, msg: MESSAGE.SUCCESS})
    }).catch(next);
});

router.post('/show_thumbsup', function (req, res, next) {

    if (req.body.mid == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.pages == null) {
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
            thumbsup.uid = d.uid;
            // 是否必须需要 ？ thumbsup.is_followed = 
            thumbsup.signature = d.signature;
            thumbsup.username = d.username;
            thumbsup.face_url = d.face_url;
            if (i >= startRow && i <= endRow) {
                thumbsups.push(thumbsup);
            }
            i++;
        });
        return res.json({status: 0, msg: MESSAGE.SUCCESS, data: thumbsups})
    }).catch(next);
});

router.post('/show_moment', function (req, res, next) {

    if (req.body.pages == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.longitude == null || req.body.latitude == null || req.body.type == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        include: [UserModel, CommentModel, ThumbsupModel],
        order: 'createdAt DESC'
    }).then(function(result) {
        console.log(result);
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
                moment.user.face_url = user.face_url;
                if (i >= startRow && i <= endRow) {
                    moments.push(moment);
                    i++;
                }
            }).catch(next);
        });
        setTimeout(function() {
            return res.json({status: 0, data: moments, msg: MESSAGE.SUCCESS});
        }, 1000)
    }).catch(next);
});

router.post('/collect_moment', function (req, res, next) {

    if (req.body.mid == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.type == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findOne({
        include: [UserModel],
        where: {
            id: req.body.mid
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
            };
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
                };
                res.json({status: 0, data: data, msg: MESSAGE.SUCCESS})
            })
        })       
    }).catch(next);
});

router.post('/show_collect_moment', function (req, res, next) {

    if (req.body.timestamp == null || req.body.token == null || req.body.uid == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    CollectionModel.findAll({
        where: {
            userId: req.body.uid
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
            };
            collections.push(data);
        });
        res.json({status: 0, data: collections, msg: MESSAGE.SUCCESS})
    }).catch(next);
});

router.post('/show_one_moment', function (req, res, next) {

    if (req.body.mid == null || req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.latitude == null || req.body.longitude == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findOne({
        include: [UserModel, CommentModel, ThumbsupModel],
        where: {
            id: req.body.mid
        }
    }).then(function (result) {
        var moment = {
            user: {}
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
});

router.post('/post_point', function (req, res, next) {

    if (req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.latitude == null || req.body.longitude == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var point = {
        userId: req.body.uid,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        createdAt: new Date().getTime()
    };

    PointModel.create(point).then(function() {
        return res.json({status: 0, msg: MESSAGE.SUCCESS});
    });
});

router.post('/get_point', function (req, res, next) {

    if (req.body.timestamp == null || req.body.token == null || req.body.uid == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    PointModel.findAll({
        where: {
            userId: req.body.uid
        }
    }).then(function(results) {
        return res.json({status: 0, data: results, msg: MESSAGE.SUCCESS});
    });
});

router.post('/get_unread', function (req, res, next) {

    if (req.body.timestamp == null || req.body.token == null || req.body.uid == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    UnreadModel.findAll({
        where: {
            uid: req.body.uid
        }
    }).then(function(results) {
        var ids = [];
        results.forEach(function(result) {
            ids.push(result.id);
        });
        MomentModel.findAll({
            where: {
                id: ids
            }
        }).then(function(moments) {
            UnreadModel.destroy({
                where: {
                    uid: req.body.uid
                }
            }).then(function() {
                return res.json({status: 0, data: moments, msg: MESSAGE.SUCCESS});
            })    
        })
    });
});

router.post('/show_moment_list', function (req, res, next) {

    if (req.body.timestamp == null || req.body.token == null || req.body.uid == null || req.body.moment_list == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }
    MomentModel.findAll({
        where: {
            id: req.body.moment_list
        },
        order: 'hot DESC',
        include: [UserModel, CommentModel, ThumbsupModel],
    }).then(function(result) {
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
                moment.user.face_url = user.face_url;
                moments.push(moment);
            }).catch(next);
        });
        setTimeout(function() {
            return res.json({status: 0, data: moments, msg: MESSAGE.SUCCESS});
        }, 1000);
    });
});

module.exports = router;
