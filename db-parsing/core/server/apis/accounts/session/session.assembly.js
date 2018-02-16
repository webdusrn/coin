var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');
var post = require('./' + resource + '.post.js');
var put = require('./' + resource + '.put.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var passport = require('passport');

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {},
                title: '로그인된 유저 정보 얻기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.getUser());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
    put: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {},
                title: '로그인된 유저 정보 얻기 (최종 접속일 갱신)',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.updateAndGetUser());
                apiCreator.add(put.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['type', 'uid', 'secret', 'platform', 'device', 'browser', 'version', 'token'],
                essential: ['type', {'uid': '400_80'}, {'secret': '400_81'}],
                resettable: [],
                explains: {
                    'type': '로그인 방식 ' + STD.user.signUpTypeEmail + ", " + STD.user.signUpTypePhone + ", " + STD.user.signUpTypePhoneId + ", " + STD.user.signUpTypeNormalId + ", " + STD.user.signUpTypePhoneEmail,
                    'uid': '이메일 혹은 번호와 같은 유저의 식별 아이디',
                    'secret': '비밀번호 혹은 인증번호',
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
                apiCreator.add(post.loginCountUpsert());
                apiCreator.add(post.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
    delete: function (isOnlyParams) {
        return function (req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {},
                title: '로그아웃',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.logout());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.get());
router.put('/' + resource, api.put());
router.post('/' + resource, api.post());
router.delete('/' + resource, api.delete());

module.exports.router = router;
module.exports.api = api;