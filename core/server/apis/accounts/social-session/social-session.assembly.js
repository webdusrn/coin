var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var passport = require('passport');

var api = {
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['provider', 'pid', 'accessToken', 'platform', 'device', 'browser', 'version', 'token'],
                essential: ['provider', 'pid', 'accessToken'],
                resettable: [],
                explains: {
                    'provider': '로그인 방식 ' + STD.user.enumProviders.join(", "),
                    'pid': 'provider id',
                    'accessToken': 'accessToken',
                    'platform': 'OS 및 버전',
                    'device': '휴대폰 기종',
                    'version': '앱버전',
                    'token': '푸시를 위한 디바이스토큰'
                },
                title: '로그인',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.getUser());
                apiCreator.add(post.removeAllSessions());
                apiCreator.add(post.logInUser());
                apiCreator.add(post.checkLoginHistoryCountAndRemove());
                apiCreator.add(post.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    }
};

router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;