var express = require('express');
var router = express.Router();
var UserModel = require('../models').User;
var FollowerModel = require('../models').Follower;
var FollowingModel = require('../models').Following;
var sha1 = require('sha1');
var md5 = require('md5');

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

/* user login */
router.post('/login', function (req, res, next) {
    var timestamp = new Date().getTime();

    if (req.body.username == undefined || req.body.username == ''
        || req.body.password == undefined || req.body.password == '') {
        res.json({status: 1});
        return;
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
            return res.json({status: 1002});
        }
        if (user.password !== req.body.password) {
            return res.json({status: 1003});
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
            created_at: user.createdAt,
            updated_at: getNowFormatDate()
        };
        res.json({status: 0, timestamp: timestamp, data: userData});
    });
});

/* user register */
router.post('/register', function (req, res, next) {
    var timestamp = new Date().getTime();

    if (req.body.face_url == undefined || req.body.face_url == ''
        || req.body.password == undefined || req.body.password == ''
        || req.body.nickname == undefined || req.body.nickname == ''
        || req.body.phonenumber == undefined || req.body.phonenumber == '') {
        res.json({status: 1});
        return;
    }
    var user = {
        username: req.body.phonenumber,
        password: sha1(req.body.password),
        face_url: req.body.face_url,
        nickname: req.body.nickname,
        sex: 0,
        follower: 0,
        following: 0
    };
    UserModel.findOne({
        where: {
            username: user.username
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
                    updated_at: getNowFormatDate()
                };
                return res.json({status: 0, timestamp: timestamp, data: userData});
            });
        } else {
            return res.json({status: 1000})
        }
    });
});

/* verify_code */
router.post('/verify_code', function(req, res, next) {
    
    if (req.body.code == undefined || req.body.code == ''
        || req.body.timestamp == undefined || req.body.timestamp == '') {
        res.json({status: 1});
        return;
    }



});

/* update */
router.post('/update', function(req, res, next) {
    if (req.body.face_url == undefined || req.body.face_url == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.nickname == undefined || req.body.nickname == ''
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
        || req.body.tags == undefined || req.body.tags == '') {
        res.json({status: 1});
        return;
    }
    UserModel.update({
        nickname: req.body.nickname,
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
        updated_at: getNowFormatDate()
    },{
        where: {
            id: req.body.uid
        }
    }).then(function(result){
        console.log('result: ' + result)
        var userData = {
            uid: req.body.id,
            nickname: req.body.nickname,
            birthday: req.body.birthday,
            career: req.body.career,
            face_url: req.body.face_url,
            hometown: req.body.hometown,
            location: req.body.location,
            phonenumber: req.body.phonenumber,
            school: req.body.school,
            sex: req.body.sex,
            tags: req.body.tags,
            signature: req.body.signature
        }
        res.json({status: 0, data: userData});
    });
    
});

/* followers */
router.post('/followers', function(req, res, next) {
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == '') {
        res.json({status: 1});
        return;
    }

    UserModel.findOne({
        include:[FollowerModel],
        where: {
            id: req.body.uid
        }
    }).then(function(user){
        return res.json({status: 0, data: user.followers});
    })

});

/* followings */
router.post('/followings', function(req, res, next) {
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == '') {
        res.json({status: 1});
        return;
    }

    UserModel.findOne({
        include:[FollowingModel],
        where: {
            id: req.body.uid
        }
    }).then(function(user){
        return res.json({status: 0, data: user.followings});
    }).catch(next);
});

/* verify_code */
router.post('/verify', function(req, res, next) {
    if (req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.username == undefined || req.body.username == '') {

        res.json({status: 1});
        return;
    }
    UserModel.findOne({
        where: {
            username: req.body.username
        }
    }).then(function (user) {
        if (user == null) {
            res.json({status: 1000});
        } else {
            res.json({status: 0});
        }
    }).catch(next);

    return;
});

/* reset_password */
router.post('/reset_password', function(req, res, next) {
    if (req.body.new_password == undefined || req.body.new_password == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.username == undefined || req.body.username == '') {

        res.json({status: 1});
        return;
    }


});

/* follow */
router.post('/follow', function(req, res, next) {
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.user_id == undefined || req.body.user_id == '') {

        res.json({status: 1});
        return;
    }

    var model = {
        follower: {},
        following: {}
    };

    UserModel.findAll({
        where: {
            id: [req.body.user_id, req.body.uid]
        }
    }).then(function (result) {
        if (result[0].id == req.body.uid) {
            model.follower = result[0];
            model.following = result[1];
        } else {
            model.follower = result[1];
            model.following = result[0];
        }
        model.fid = model.follower.id
        model.tid = model.following.id
        FollowerModel.create(model).then(function (result) {
            return res.json({status: 0});
        }).catch(next);
    }).catch(next);
    
});

/* unfollow */
// TODO
router.post('/unfollow', function(req, res, next) {
    if (req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.token == undefined || req.body.token == ''
        || req.body.user_id == undefined || req.body.user_id == '') {

        res.json({status: 1});
        return;
    }

    FollowingModel.destroy({
        where: {

        }
    }).then().catch(next);

    FollowerModel.destroy({
        where: {

        }
    }).then().catch(next);
});


module.exports = router;
