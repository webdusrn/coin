var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['token', 'type', 'successRedirect', 'errorRedirect', 'email'],
                essential: ['token', 'type'],
                resettable: [],
                explains: {
                    'token': 'email token',
                    'email': "findPass의 경우 redirect될 때 필요한 이메일 authEmailFindPass의 경우 필수값임.",
                    'type': '인증 타입, ' + [STD.user.authEmailSignup, STD.user.authEmailFindPass, STD.user.authEmailAdding].join(", "),
                    'successRedirect': '인증 성공 후 리다이렉트될 경로, 혹은 비밀번호찾기 화면의 경로',
                    'errorRedirect': '인증 실패 후 리다이렉트될 경로'
                },
                title: '이메일연동벨리데이션',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.consent());
                apiCreator.add(get.supplement());
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
                explains: {
                    id: 'user id'
                },
                response: resforms.user,
                title: '이메일제거 (이메일만제거됨)',
                param: 'id',
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
                apiCreator.add(req.middles.role.userIdChecker('params', 'id', STD.role.account));
                apiCreator.add(del.validate());
                apiCreator.add(del.removeEmail());
                apiCreator.add(del.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.get());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;