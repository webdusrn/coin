var request = require('request');
module.exports = {
    facebookValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        var rootUri = 'https://graph.facebook.com/me?access_token=';
        var option = {
            method: 'GET',
            uri: rootUri + secret
        };
        request(option, function (error, response, body) {
            if (response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.id == uid) {
                    callback(200);
                } else {
                    callback(403);
                }
            } else {
                callback(403);
            }
        });
    },
    kakaoValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        var rootUri = 'https://kapi.kakao.com/v1/user/access_token_info';
        var option = {
            method: 'GET',
            uri: rootUri,
            headers: {
                'Authorization': "Bearer " + secret,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        };
        request(option, function (error, response, body) {
            if (response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.id == uid) {
                    callback(200);
                } else {
                    callback(403);
                }
            } else {
                callback(403);
            }
        });
    },
    googleValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        callback(200);
    },
    twitterValidadtor: function (uid, secret, callback) {
        if (process.env.NODE_ENV == "test") {
            return callback(200);
        }
        callback(200);
    }
};