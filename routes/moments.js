var express = require('express');
var router = express.Router();

router.post('/post_moment', function (req, res, next) {

    if (req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.filename == undefined || req.body.filename == '') {


        return res.json({status: 1, qiniu_token: qiniu_token});
    }
});

router.post('/show_moment', function (req, res, next) {

    if (req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.filename == undefined || req.body.filename == '') {


        return res.json({status: 1, qiniu_token: qiniu_token});
    }
});

module.exports = router;