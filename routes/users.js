var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var md5 = require('md5');

var UserModel = require('../models').User;
var FollowerModel = require('../models').Follower;

var KEY = require('.config').KEY;
var MESSAGE = require('.config').MESSAGE;
var log = require('./config').log;
var YUNPIAN_APIKEY = require('./config').YUNPIAN_APIKEY;

/* user login */
router.post('/login', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.phonenumber == undefined || req.body.phonenumber == ''
        || req.body.password == undefined || req.body.password == ''
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.longitude == undefined || req.body.longitude == '') {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var user = {
        username: req.body.username,
        password: sha1(req.body.password)
    };
    UserModel.findOne({
        where: {
            username: user.username
        }
    }).then(function (user) {
        if (!user) {
            return res.json({status: 1002, msg: MESSAGE.USER_NOT_EXIST});
        }
        if (user.password !== sha1(req.body.password)) {
            return res.json({status: 1003, msg: MESSAGE.PASSWORD_ERROR});
        }
        var token = md5(user.id + timestamp + KEY);
        var userData = {
            uid: user.id,
            username: user.username,
            token: token,
            birthday: user.birthday,
            career: user.career,
            face_url: user.face_url,
            follower: user.follower,
            following: user.following,
            hometown: user.hometown,
            location: user.location,
            phonenumber: user.phonenumber,
            school: user.school,
            sex: user.sex,
            signature: user.signature,
            tags: user.tags,
            ride_read_id: user.ride_read_id,
            longitude: user.longitude,
            latitude: user.latitude,
            created_at: user.createdAt,
            updated_at: timestamp
        };
        res.json({status: 0, timestamp: timestamp, data: userData, msg: MESSAGE.SUCCESS});
    });
});

/* reset_password */
router.post('/reset_password', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.new_password == undefined || req.body.new_password == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.username == undefined || req.body.username == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    UserModel.update({
            password: sha1(req.body.new_password)
        },{
            where: {
                username: req.body.username
            }
        }).then(function (result) {
            if (result == 1) {
                res.json({status: 0, msg: MESSAGE.SUCCESS});
                return;
            } else {
                res.json({status: 1002, msg: MESSAGE.USER_NOT_EXIST});
                return;
            }
    }).catch(next);
});

/* login_out */
router.post('/login_out', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    return res.json({status: 0, msg: MESSAGE.SUCCESS});
});

/* user register */
router.post('/register', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.face_url == undefined || req.body.face_url == ''
        || req.body.password == undefined || req.body.password == ''
        || req.body.username == undefined || req.body.username == ''
        || req.body.ride_read_id == undefined || req.body.nickname == ''
        || req.body.phonenumber == undefined || req.body.phonenumber == '') {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var user = {
        phonenumber: req.body.phonenumber,
        password: sha1(req.body.password),
        face_url: req.body.face_url,
        username: req.body.username,
        sex: 0,
        follower: 0,
        following: 0,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    UserModel.findOne({
        where: {
            phonenumber: user.phonenumber
        }
    }).then(function (result) {
        if (!result) {
            UserModel.create(user).then(function (user) {
                var token = md5(user.id + timestamp + KEY);
                var userData = {
                    uid: user.id,
                    username: user.username,
                    token: token,
                    birthday: user.birthday,
                    career: user.career,
                    face_url: user.face_url,
                    follower: user.follower,
                    following: user.following,
                    hometown: user.hometown,
                    location: user.location,
                    phonenumber: user.phonenumber,
                    school: user.school,
                    sex: user.sex,
                    tags: user.tags,
                    signature: user.signature,
                    created_at: user.createdAt,
                    updated_at: getNowFormatDate(),
                    latitude: user.latitude,
                    longitude: user.longitude,
                    ride_read_id: user.ride_read_id
                };
                return res.json({status: 0, timestamp: timestamp, data: userData, msg: MESSAGE.SUCCESS});
            });
        } else {
            return res.json({status: 1005, msg: MESSAGE.USER_ALREADY_EXIST})
        }
    });
});

/* update */
router.post('/update', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.face_url == undefined || req.body.face_url == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.username == undefined || req.body.username == ''
        || req.body.phonenumber == undefined || req.body.phonenumber == ''
        || req.body.birthday == undefined || req.body.birthday == ''
        || req.body.hometown == undefined || req.body.hometown == ''
        || req.body.location == undefined || req.body.location == ''
        || req.body.school == undefined || req.body.school == ''
        || req.body.sex == undefined || req.body.sex == ''
        || req.body.signature == undefined || req.body.signature == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.career == undefined || req.body.career == ''
        || req.body.tags == undefined || req.body.tags == ''
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.longitude == undefined || req.body.longitude == '') {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    UserModel.update({
        username: req.body.username,
        birthday: req.body.birthday,
        tags: req.body.tags,
        career: req.body.career,
        face_url: req.body.face_url,
        hometown: req.body.hometown,
        location: req.body.location,
        phonenumber: req.body.phonenumber,
        school: req.body.school,
        sex: req.body.sex,
        signature: req.body.signature,
        updated_at: timestamp,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    },{
        where: {
            id: req.body.uid
        }
    }).then(function(result){
        console.log('result: ' + result)
        var userData = {
            uid: req.body.id,
            username: req.body.username,
            birthday: req.body.birthday,
            career: req.body.career,
            face_url: req.body.face_url,
            hometown: req.body.hometown,
            location: req.body.location,
            phonenumber: req.body.phonenumber,
            school: req.body.school,
            sex: req.body.sex,
            tags: req.body.tags,
            signature: req.body.signature,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }
        res.json({status: 0, data: userData, msg: MESSAGE.SUCCESS});
    });
    
});

/* followers */
router.post('/followers', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == '') {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    FollowerModel.findAll({
        tid: req.body.uid
    }).then(function(followers) {

        var ids = [];

        followers.forEach(function(result) {
            ids.push(result.id);
        })

        UserModel.findAll({
            id: ids
        }).then(function(users) {
            var followerData = [];
            users.forEach(function(user) {
                var follower = {};
                follower.fid = user.id;
                follower.follower_signature = user.signature;
                follower.follower_face_url = user.face_url;
                follower.follower_username = user.username;
                followerData.push(follower);
            })
            return res.json({status: 0, data: followerData, msg: MESSAGE.SUCCESS});
        })

    })

});

/* followings */
router.post('/followings', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == '') {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    FollowerModel.findAll({
        fid: req.body.uid
    }).then(function(followings) {

        var ids = [];

        followings.forEach(function(result) {
            ids.push(result.id);
        })

        UserModel.findAll({
            id: ids
        }).then(function(users) {
            var followingData = [];
            users.forEach(function(user) {
                var following = {};
                following.fid = user.id;
                following.followed_signature = user.signature;
                following.followed_face_url = user.face_url;
                following.followed_username = user.username;
                followingData.push(following);
            })
            return res.json({status: 0, data: followingData, msg: MESSAGE.SUCCESS});
        })

    })
});

/* verify */
router.post('/verify', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.ride_read_id == undefined || req.body.ride_read_id == '') {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    UserModel.findOne({
        where: {
            ride_read_id: req.body.ride_read_id
        }
    }).then(function (user) {
        if (user == null) {
            res.json({status: 1002, msg: MESSAGE.USER_NOT_EXIST});
        } else {
            res.json({status: 0, msg: MESSAGE.SUCCESS});
        }
    }).catch(next);

    return;
});

/* follow */
router.post('/follow', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.user_id == undefined || req.body.user_id == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var model = {
        tid: req.body.user_id,
        fid: req.body.uid
    };

    UserModel.findAll({
        where: {
            id: [req.body.uid, req.body.user_id]
        }
    }).then(function(users) {
        if (users[0].id == req.body.uid) {
            model.f_username = users[0].username;
            model.f_signature = users[0].signature;
            model.f_face_url = users[0].face_url;
            model.t_username = users[1].username;
            model.t_signature = users[1].signature;
            model.t_face_url = users[1].face_url;
        } else {
            model.f_username = users[1].username;
            model.f_signature = users[1].signature;
            model.f_face_url = users[1].face_url;
            model.t_username = users[0].username;
            model.t_signature = users[0].signature;
            model.t_face_url = users[0].face_url;
        }
        FollowerModel.create(model).then(function() {
            return res.json({status: 0, msg: MESSAGE.SUCCESS});
        })
    })

    
});

/* unfollow */
router.post('/unfollow', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.user_id == undefined || req.body.user_id == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    FollowerModel.destroy({
        where: {
            fid: req.body.uid,
            tid: req.body.user_id
        }
    }).then(function (){
        return res.json({status: 0, msg: MESSAGE.SUCCESS});
    }).catch(next);
});

/* show_user_info */
router.post('/show_user_info', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.type == undefined || req.body.type == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    if (req.body.type == 1) {
        UserModel.findOne({
            where: {
                id: req.body.uid
            }
        }).then(function (user) {
            var userData = {
                uid: user.id,
                username: user.username,
                token: token,
                birthday: user.birthday,
                career: user.career,
                face_url: user.face_url,
                follower: user.follower,
                following: user.following,
                hometown: user.hometown,
                location: user.location,
                phonenumber: user.phonenumber,
                school: user.school,
                sex: user.sex,
                signature: user.signature,
                tags: user.tags,
                ride_read_id: user.ride_read_id,
                longitude: user.longitude,
                latitude: user.latitude,
                created_at: user.createdAt,
                updated_at: timestamp,
                is_followed: 0
            };
            return res.json({status: 0, data: userData, msg: MESSAGE.SUCCESS});
        })
    }

    if (req.body.type == 2) {
        UserModel.findOne({
            where: {
                id: req.body.user_id
            }
        }).then(function (user) {
            var userData = {
                uid: user.id,
                username: user.username,
                token: token,
                birthday: user.birthday,
                career: user.career,
                face_url: user.face_url,
                follower: user.follower,
                following: user.following,
                hometown: user.hometown,
                location: user.location,
                phonenumber: user.phonenumber,
                school: user.school,
                sex: user.sex,
                signature: user.signature,
                tags: user.tags,
                ride_read_id: user.ride_read_id,
                longitude: user.longitude,
                latitude: user.latitude,
                created_at: user.createdAt,
                updated_at: timestamp,
                is_followed: 0
            };
            FollowerModel.findOne({
                tid: req.body.uid,
                fid: req.body.user_id
            }).then(function(result) {
                if (!result) {
                    return res.json({status: 0, data: userData, msg: MESSAGE.SUCCESS});
                } else {
                    userData.is_followed = 1
                    return res.json({status: 0, data: userData, msg: MESSAGE.SUCCESS});
                }
            })

            
        })
    }
});

/* search_follower_or_following */
router.post('/search_follower_or_following', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.shortname == undefined || req.body.shortname == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    FollowerModel.findAll({
        where: {
            username: {
                '$like': '%' + req.body.shortname + '%', 
            },
            // '$or': [
            //     {'fid': req.body.uid},
            //     {'tid': req.body.uid}
            // ]
            fid: req.body.uid
        }
    }).then(function(followings) {
        var followingsData = [];
        followings.forEach(function(result) {
            var user = {};
            user.followed_username = result.username;
            user.tid = result.id;
            user.followed_signature = result.signature;
            user.followed_face_url = result.face_url;
            followingsData.push(user);
        })
        FollowerModel.findAll({
            where: {
                username: {
                    '$like': '%' + req.body.shortname + '%', 
                },
                tid: req.body.uid
            }
        }).then(function(followers) {
            var followersData = [];
            followers.forEach(function(result) {
                var user = {};
                user.follower_username = result.username;
                user.fid = result.id;
                user.follower_signature = result.signature;
                user.follower_face_url = result.face_url;
                followersData.push(user);
            })
            res.json({status: 0, timestamp: timestamp, followeds: followingsData, followers: followersData, msg: MESSAGE.SUCCESS});
            return;
        })
    }).catch(next);
});

/* show_user_info_list */
router.post('/show_user_info_list', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.user_ids == undefined || req.body.user_ids == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var ids = req.body.user_ids.split(',');
    UserModel.findAll({
        where: {
            id: ids,
        }
    }).then(function(result) {
        var users = [];
        result.forEach(function (item){
            var user = {};
            user.uid = item.id;
            user.username = item.username;
            user.face_url = item.face_url;
            users.push(user);
        }) 
        res.json({status: 0, msg: MESSAGE.SUCCESS, data: users})
        return;
    }).catch(next);
});

module.exports = router;
