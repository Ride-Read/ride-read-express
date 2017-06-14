var express = require('express');
var router = express.Router();
var qiniu = require('qiniu');
var https = require('https');
var querystring = require('querystring');

var QINIU_ACCESS = require('./config').QINIU_ACCESS;
var QINIU_SECRET = require('./config').QINIU_SECRET;
var BUCKET = require('./config').BUCKET;
var MESSAGE = require('./config').MESSAGE;
var ADMIN_USER = require('./config').ADMIN_USER;
var ADMIN_PASSWORD = require('./config').ADMIN_PASSWORD;
var YUNPIAN_APIKEY = require('./config').YUNPIAN_APIKEY;

var UserModel = require('../models').User;
var SmsCodeModel = require('../models').SmsCode;

qiniu.conf.ACCESS_KEY = QINIU_ACCESS;
qiniu.conf.SECRET_KEY = QINIU_SECRET;

function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}

/* 获取七牛token */
router.post('/qiniu_token', function (req, res, next) {

    if (req.body.token == undefined || req.body.token == ''
        || req.body.uid == undefined || req.body.uid == ''
        || req.body.filename == undefined || req.body.filename == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }
	var qiniu_token = uptoken('rideread', req.body.filename);

    return res.json({status: 0, qiniu_token: qiniu_token, msg: MESSAGE.SUCCESS});
});

/* util/yun_pian_code */
router.post('/yun_pian_code', function (req, res, next) {

    if (req.body.timestamp == undefined || req.body.timestamp == ''
        || req.body.phonenumber == undefined || req.body.phonenumber == '') {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }
    var code = Math.floor(Math.random() * 899999 + 100000)

    var postData = {
        mobile: req.body.phonenumber,
        text:'【双生APP】您的验证码是' +  code,
        apikey: YUNPIAN_APIKEY 
    };

    var content = querystring.stringify(postData);

    var options = {
        host: 'sms.yunpian.com',
        path: '/v2/sms/single_send.json',
        method: 'POST',
        agent: false,
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        }
    };

    var model = {
        phonenumber: req.body.phonenumber,
        rand_code: code,
        timestamp: timestamp,
        used: false
    }

   	SmsCodeModel.findAll({
        where: {
            phonenumber: req.body.phonenumber,
            used: false
        }
    }).then(function(results) {
        if (results[0] !== undefined) {
            console.log('连续请求:' + (timestamp - results[0].timestamp));
            if(timestamp - results[0].timestamp < 600000) {
                res.json({status: 5000, msg: MESSAGE.REQUEST_ERROR});
                return;
            }
        }
        SmsCodeModel.create(model).then(function() {
            return res.json({status: 0, msg: MESSAGE.SUCCESS});
        }).catch(next);

        var req = https.request(options,function(res){
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log(JSON.parse(chunk));
            });
            res.on('end',function(){
                console.log('over');
            });
        });
        req.write(content);
        req.end();
    })

    return res.json({status: 0, msg: MESSAGE.SUCCESS});
});

module.exports = router;
