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


router.post('/', function (req, res, next) {
	
});

module.exports = router;
