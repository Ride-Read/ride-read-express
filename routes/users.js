var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
var sha1 = require('sha1');
var md5 = require('md5');

var key = 'airing';

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + 'T' + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds() + '.000Z';
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
        var token = md5(user.id + timestamp + key);
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
            created_at: user.createdAt,
            updated_at: getNowFormatDate()
        };
        res.json({status: 0, timestamp: timestamp, user: userData});
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
        sex: 0
    };
    UserModel.findOne({
        where: {
            username: user.username
        }
    }).then(function (result) {
        if (!result) {
            UserModel.create(user).then(function (user) {
                var token = md5(user.id + timestamp + key);
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
                    created_at: user.createdAt,
                    updated_at: getNowFormatDate()
                };
                return res.json({status: 0, timestamp: timestamp, user: userData});
            });
        } else {
            return res.json({status: 1000})
        }
    });
});

module.exports = router;
