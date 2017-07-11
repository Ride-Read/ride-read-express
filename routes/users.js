var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var md5 = require('md5');

var UserModel = require('../models').User;
var FollowerModel = require('../models').Follower;
var RemarkModel = require('../models').Remark;

var KEY = require('./config').KEY;
var MESSAGE = require('./config').MESSAGE;
var log = require('./config').log;
var YUNPIAN_APIKEY = require('./config').YUNPIAN_APIKEY;

/* user login */
router.post('/login', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.phonenumber == null || req.body.password == null || req.body.latitude == null || req.body.longitude == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    UserModel.findOne({
        where: {
            phonenumber: req.body.phonenumber
        }
    }).then(function (user) {
        if (!user) {
            return res.json({status: 1002, msg: MESSAGE.USER_NOT_EXIST});
        }
        if (user.password !== req.body.password) {
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
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            created_at: user.createdAt,
            updated_at: timestamp
        };
        UserModel.update({
            longitude: req.body.longitude,
            latitude: req.body.latitude,
        },{
            where: {
                phonenumber: req.body.phonenumber
            }
        }).then(function() {
            return res.json({status: 0, timestamp: timestamp, data: userData, msg: MESSAGE.SUCCESS});
        })  
    });
});

/* reset_password */
router.post('/reset_password', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.new_password == null || req.body.timestamp == null || req.body.phonenumber == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    UserModel.update({
            password: sha1(req.body.new_password)
        },{
            where: {
                phonenumber: req.body.phonenumber
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

    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    return res.json({status: 0, msg: MESSAGE.SUCCESS});
});

/* user register */
router.post('/register', function (req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.face_url == null || req.body.password == null || req.body.username == null || req.body.ride_read_id == null || req.body.phonenumber == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var user = {
        phonenumber: req.body.phonenumber,
        password: sha1(req.body.password),
        face_url: req.body.face_url,
        username: req.body.username,
        sex: 0,
        ride_read_id: req.body.ride_read_id,
        follower: 0,
        following: 0,
        signature: 'null'
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
                    latitude: user.latitude,
                    longitude: user.longitude,
                    ride_read_id: user.ride_read_id
                };
                return res.json({status: 0, timestamp: timestamp, data: userData, msg: MESSAGE.SUCCESS});
            });
        } else {
            return res.json({status: 1005, msg: MESSAGE.USER_ALREADY_EXIST});
        }
    });
});

/* update */
router.post('/update', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.face_url == null || req.body.uid == null || req.body.username == null || req.body.phonenumber == null || req.body.birthday == null || req.body.hometown == null || req.body.location == null || req.body.school == null || req.body.sex == null || req.body.signature == null || req.body.timestamp == null || req.body.token == null || req.body.career == null || req.body.tags == null || req.body.latitude == null || req.body.longitude == null) {
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

    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.user_id == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    FollowerModel.findAll({
        where: {
            tid: req.body.user_id
        }
    }).then(function(followers) {

        var ids = [];

        followers.forEach(function(result) {
            ids.push(result.fid);
        });

        UserModel.findAll({
            where: {
                id: ids
            }
        }).then(function(users) {
            var followerData = [];
            users.forEach(function(user) {
                var follower = {};
                follower.fid = user.id;
                follower.follower_signature = user.signature;
                follower.follower_face_url = user.face_url;
                follower.follower_username = user.username;
                followerData.push(follower);
            });
            return res.json({status: 0, data: followerData, msg: MESSAGE.SUCCESS});
        })
    })
});

/* followings */
router.post('/followings', function(req, res, next) {

    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.user_id == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    FollowerModel.findAll({
        where: {
            fid: req.body.user_id
        }
    }).then(function(followings) {

        var ids = [];

        followings.forEach(function(result) {
            ids.push(result.tid);
        });

        UserModel.findAll({
            where: {
                id: ids
            }
        }).then(function(users) {
            var followingData = [];
            users.forEach(function(user) {
                var following = {};
                following.fid = user.id;
                following.followed_signature = user.signature;
                following.followed_face_url = user.face_url;
                following.followed_username = user.username;
                followingData.push(following);
            });
            return res.json({status: 0, data: followingData, msg: MESSAGE.SUCCESS});
        })
    })
});

/* verify */
router.post('/verify', function(req, res, next) {

    if (req.body.timestamp == null || req.body.ride_read_id == null) {
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
});

/* follow */
router.post('/follow', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.user_id == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var model = {
        tid: req.body.user_id,
        fid: req.body.uid
    };
    FollowerModel.findOne({
        where: {
            tid: req.body.user_id,
            fid: req.body.uid
        }
    }).then(function(result) {
        if (!result) {
            UserModel.findAll({
                where: {
                    id: [req.body.uid, req.body.user_id]
                }
            }).then(function(users) {
                var user1 = {};
                var user2 = {};
                if (users[0].id == req.body.uid) {
                    model.f_username = users[0].username;
                    model.f_signature = users[0].signature;
                    model.f_face_url = users[0].face_url;
                    model.t_username = users[1].username;
                    model.t_signature = users[1].signature;
                    model.t_face_url = users[1].face_url;
                    user1 = users[0];
                    user2 = users[1];
                    user1.following++;
                    user2.follower++;
                } else {
                    model.f_username = users[1].username;
                    model.f_signature = users[1].signature;
                    model.f_face_url = users[1].face_url;
                    model.t_username = users[0].username;
                    model.t_signature = users[0].signature;
                    model.t_face_url = users[0].face_url;
                    user1 = users[1];
                    user2 = users[0];
                    user1.following++;
                    user2.follower++;
                }
                UserModel.update({following: user1.following}, {
                    where: {
                        id: req.body.uid
                    }
                }).then(function() {
                    UserModel.update({follower: user2.follower}, {
                        where: {
                            id: req.body.user_id
                        }
                    }).then(function() {
                        FollowerModel.create(model).then(function() {
                            return res.json({status: 0, msg: MESSAGE.SUCCESS});
                        })
                    })
                }) 
            })
        } else {
            return res.json({status: 5001, msg: MESSAGE.FOLLOWER_IS_EXISE});
        }
    })
});

/* unfollow */
router.post('/unfollow', function(req, res, next) {

    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.user_id == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }
    UserModel.findAll({
        where: {
            id: [req.body.uid, req.body.user_id]
        }
    }).then(function(users) {
        var user1 = {};
        var user2 = {};
        if (users[0].id == req.body.uid) {
            user1 = users[0];
            user2 = users[1];
            user1.following--;
            user2.follower--;
        } else {
            user1 = users[1];
            user2 = users[0];
            user1.following--;
            user2.follower--;
        }
        console.log(user1.following);
        UserModel.update({following: user1.following}, {
            where: {
                id: req.body.uid
            }
        }).then(function() {
            UserModel.update({follower: user2.follower}, {
                where: {
                    id: req.body.user_id
                }
            }).then(function() {
                FollowerModel.destroy({
                    where: {
                        fid: req.body.uid,
                        tid: req.body.user_id
                    }
                }).then(function (){
                    return res.json({status: 0, msg: MESSAGE.SUCCESS});
                })
            })
        })
    })
});

/* show_user_info */
router.post('/show_user_info', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.type == null || req.body.user_id == null) {

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
        var nickname = '';
        RemarkModel.findOne({
            where: {
                uid: req.body.uid,
                user_id: req.body.user_id
            }
        }).then(function(result) {
            if (result) {
                nickname = result.nickname
            }
            UserModel.findOne({
                where: {
                    id: req.body.user_id
                }
            }).then(function (user) {
                var userData = {
                    uid: user.id,
                    username: user.username,
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
                    is_followed: 0,
                    remark: nickname
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

        })
        
    }
});

/* search_follower_or_following */
router.post('/search_follower_or_following', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.shortname == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    FollowerModel.findAll({
        where: {
            f_username: {
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
            user.followed_username = result.t_username;
            user.tid = result.tid;
            user.followed_signature = result.t_signature;
            user.followed_face_url = result.t_face_url;
            followingsData.push(user);
        });
        FollowerModel.findAll({
            where: {
                t_username: {
                    '$like': '%' + req.body.shortname + '%', 
                },
                tid: req.body.uid
            }
        }).then(function(followers) {
            var followersData = [];
            followers.forEach(function(result) {
                var user = {};
                user.follower_username = result.f_username;
                user.fid = result.fid;
                user.follower_signature = result.f_signature;
                user.follower_face_url = result.f_face_url;
                followersData.push(user);
            });
            return res.json({status: 0, timestamp: timestamp, followeds: followingsData, followers: followersData, msg: MESSAGE.SUCCESS});
        })
    }).catch(next);
});

/* show_user_info_list */
router.post('/show_user_info_list', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.user_ids == null) {

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
        });
        return res.json({status: 0, msg: MESSAGE.SUCCESS, data: users});
    }).catch(next);
});

/* bind_account */
router.post('/bind_account', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.openid == null || req.body.phonenumber == null || req.body.type == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    switch(parseInt(req.body.type)){
        case 1:
            UserModel.update({
                openid1: req.body.openid
            }, {
                where: {
                    phonenumber: req.body.phonenumber
                }
            }).then(function() {
                res.json({status: 0, msg: MESSAGE.SUCCESS});
                return;
            });
            break;
        case 2:
            UserModel.update({
                openid2: req.body.openid
            }, {
                where: {
                    phonenumber: req.body.phonenumber
                }
            }).then(function() {
                res.json({status: 0, msg: MESSAGE.SUCCESS});
                return;
            });
            break;
        case 3:
            UserModel.update({
                openid3: req.body.openid
            }, {
                where: {
                    phonenumber: req.body.phonenumber
                }
            }).then(function() {
                res.json({status: 0, msg: MESSAGE.SUCCESS});
                return;
            });
            break;
        default:
            return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
            break;
    }
});

/* oauth_login */
router.post('/oauth_login', function(req, res, next) {

    var timestamp = new Date().getTime();
    
    if (req.body.latitude == null || req.body.longitude == null || req.body.type == null || req.body.openid == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    switch(parseInt(req.body.type)){
        case 1:
            UserModel.findOne({
                where: {
                    openid1: req.body.openid
                }
            }).then(function(user) {
                if (!user) {
                    return res.json({status: 1002, msg: MESSAGE.USER_NOT_EXIST});
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
            break;
        case 2:
            UserModel.findOne({
                where: {
                    openid2: req.body.openid
                }
            }).then(function(user) {
                if (!user) {
                    return res.json({status: 1002, msg: MESSAGE.USER_NOT_EXIST});
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
            break;
        case 3:
            UserModel.findOne({
                where: {
                    openid3: req.body.openid
                }
            }).then(function(user) {
                if (!user) {
                    return res.json({status: 1002, msg: MESSAGE.USER_NOT_EXIST});
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
            break;
        default:
            return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR});
            break;
    }
});

/* remark */
router.post('/remark', function(req, res, next) {

    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.user_id == null || req.body.nickname == null) {

        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    var data = {
        uid: req.body.uid,
        user_id: req.body.user_id,
        nickname: req.body.nickname
    };

    RemarkModel.findOne({
        where: {
            uid: req.body.uid,
            user_id: req.body.user_id
        }
    }).then(function(result) {
        if (!result) {
            RemarkModel.create(data).then(function() {
                return res.json({status: 0, msg: MESSAGE.SUCCESS});
            })
        } else {
            RemarkModel.update({
                nickname: req.body.nickname
            }, {
                where: {
                    uid: req.body.uid,
                    user_id: req.body.user_id
                }
            }).then(function() {
                return res.json({status: 0, msg: MESSAGE.SUCCESS});
            })
        }
        return res.json({status: 0, msg: MESSAGE.SUCCESS});
    })
});

/* interest_user */
router.post('/interest_user', function(req, res, next) {

    var timestamp = new Date().getTime();

    if (req.body.uid == null || req.body.timestamp == null || req.body.token == null || req.body.ride_read_id == null) {
        return res.json({status: 1000, msg: MESSAGE.PARAMETER_ERROR})
    }

    // 推荐条件待定
    UserModel.findAll({
        where: {
            $or: [
                {ride_read_id: req.body.ride_read_id}
            ]
        }
    }).then(function(result) {
        var users = [];
        result.forEach(function(data) {
            var user = {};
            user.uid = data.id;
            user.face_url = data.face_url;
            user.username = data.username;
            users.push(user);
        });
        return res.json({status: 0, msg: MESSAGE.SUCCESS, data: users});
    })
});

module.exports = router;
