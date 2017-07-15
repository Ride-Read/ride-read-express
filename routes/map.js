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
    if (req.body.token == null || req.body.uid == null || req.body.timestamp == null || req.body.latitude == null || req.body.longitude == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        where: {
            latitude: {
                '$gte': parseFloat(req.body.latitude) - 3,
                '$lte': parseFloat(req.body.latitude) + 3,
            },
            longitude: {
                '$gte': parseFloat(req.body.longitude) - 3,
                '$lte': parseFloat(req.body.longitude) + 3,
            }
        }
    }).then(function (result) {
        if (result[0] === undefined) {
            res.json({status: 4000, msg: MESSAGE.MOMENT_IS_NULL});
            return;
        }
        res.json({status: 0, data: result, msg: MESSAGE.SUCCESS});
        return;
    })
});

router.post('/show_user_map', function (req, res, next) {
    if (req.body.token == null || req.body.uid == null || req.body.timestamp == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        where: {
            userId: req.body.uid
        }
    }).then(function (result) {
        if (result[0] === undefined) {
            res.json({status: 4000, msg: MESSAGE.MOMENT_IS_NULL});
            return;
        }
        return res.json({status: 0, data: result, msg: MESSAGE.SUCCESS})
    })
});

// WARNING: 即将废弃的接口
router.post('/show_map_number', function (req, res, next) {
    if (req.body.token == null || req.body.uid == null || req.body.timestamp == null || req.body.latitude == null || req.body.longitude == null || req.body.scaling_ratio == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }
});

router.post('/show_other_user_map', function (req, res, next) {
    if (req.body.token == null || req.body.uid == null || req.body.timestamp == null || req.body.user_id == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        where: {
            userId: req.body.user_id
        }
    }).then(function (result) {
        if (result[0] === undefined) {
            res.json({status: 4000, msg: MESSAGE.MOMENT_IS_NULL});
            return;
        }
        return res.json({status: 0, data: result, msg: MESSAGE.SUCCESS})
    })
});

router.post('/show_map', function (req, res, next) {

    if (req.body.token == null || req.body.uid == null || req.body.timestamp == null || req.body.last == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    MomentModel.findAll({
        where: {
            createdAt: {
                $gte: parseInt(req.body.last) 
            }
        },
        order: 'hot DESC'
    }).then(function (result) {
        if (result[0] === undefined) {
            res.json({status: 4000, msg: MESSAGE.MOMENT_IS_NULL});
            return;
        }
        var map = [];
        result.forEach(function (data) {
            var moment = {};
            moment.mid = data.id;
            moment.createdAt = data.createdAt;
            moment.pictures = data.pictures;
            moment.latitude = data.latitude;
            moment.longitude = data.longitude;
            map.push(moment);
        })
        return res.json({status: 0, data: map, msg: MESSAGE.SUCCESS})
    })
});

module.exports = router;
