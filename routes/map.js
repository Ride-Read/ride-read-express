var express = require('express');
var router = express.Router();
var UserModel = require('../models').User;
var MomentModel = require('../models').Moment;
var CommentModel = require('../models').Comment;
var ThumbsupModel = require('../models').Thumbsup;
var CollectionModel = require('../models').Collection;

var KEY = require('./config').KEY;
var MESSAGE = require('./config').MESSAGE;
var LantitudeLongitudeDist = require('./config').LantitudeLongitudeDist;


router.post('/show_near_map', function (req, res, next) {
	if (req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.longitude == undefined || req.body.longitude == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        where: {
            latitude: {
                '$gte': parseInt(req.body.latitude - 3),
                '$lte': parseInt(req.body.latitude + 3),
            },
            longitude: {
                '$gte': parseInt(req.body.longitude - 3),
                '$lte': parseInt(req.body.longitude + 3),
            }
        }
    }).then(function(result) {
        return res.json({status: 0, data: result, msg: MESSAGE.SUCCESS})
    })
    return res.json({status: 4000, msg: MESSAGE.MOMENT_IS_NULL})
});

router.post('/show_user_map', function (req, res, next) {
	if (req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        where: {
            userId: req.body.uid
        }
    }).then(function(result) {
        return res.json({status: 0, data: result, msg: MESSAGE.SUCCESS})
    })
    return res.json({status: 4000, msg: MESSAGE.MOMENT_IS_NULL})
});

router.post('/show_map_number', function (req, res, next) {
	if (req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.latitude == undefined || req.body.latitude == ''
        || req.body.longitude == undefined || req.body.longitude == ''
        || req.body.scaling_ratio == undefined || req.body.scaling_ratio == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    
});

router.post('/show_other_user_map', function (req, res, next) {
	if (req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.timestamp == undefined || req.body.timestamp == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        where: {
            userId: req.body.uid
        }
    }).then(function(result) {
        return res.json({status: 0, data: result, msg: MESSAGE.SUCCESS})
    })
    return res.json({status: 4000, msg: MESSAGE.MOMENT_IS_NULL})
});

module.exports = router;
