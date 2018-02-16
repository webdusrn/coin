var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
// var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
// var put = require('./' + resource + '.put.js');
// var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms/index');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'key': '데이터를 얻을 리소스의 key'
                },
                role: STD.role.account,
                param: 'key',
                response: resforms.notification,
                title: '노티피케이션 단일 얻기',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.role.account));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    },
    // gets: function (isOnlyParams) {
    //     return function (req, res, next) {
    //
    //         var params = {
    //             acceptable: ['type', 'isStored', 'isOption'],
    //             essential: [],
    //             resettable: [],
    //             explains: {
    //                 'type': 'notification type ' + STD.notification.enumPublicNotificationTypes.join(", "),
    //                 'isStored': 'notification-box에 저장할지 여부',
    //                 'isOption': '유저 switch option에 표시할 지 여부'
    //             },
    //             response: {rows:[resforms.notification]},
    //             role: STD.role.account,
    //             title: '노티피케이션 전체 얻기',
    //             state: 'development'
    //         };
    //
    //         if (!isOnlyParams) {
    //             var apiCreator = new HAPICreator(req, res, next);
    //
    //             apiCreator.add(req.middles.session.loggedInRole(STD.role.account));
    //             apiCreator.add(req.middles.validator(
    //                 params.acceptable,
    //                 params.essential,
    //                 params.resettable
    //             ));
    //             apiCreator.add(gets.validate());
    //             apiCreator.add(gets.setParam());
    //             apiCreator.add(gets.supplement());
    //             apiCreator.run();
    //         }
    //         else {
    //             return params;
    //         }
    //     };
    // },
    // post: function (isOnlyParams) {
    //     return function (req, res, next) {
    //
    //         var params = {
    //             acceptable: ['type', 'key', 'title', 'body', 'data', 'img', 'isStored', 'isOption', 'description'],
    //             essential: ['type', 'key', 'title', 'body', 'data', 'img', 'isStored', 'isOption', 'description'],
    //             resettable: [],
    //             explains: {
    //                 'type': 'notification type ' + STD.notification.enumPublicNotificationTypes.join(", "),
    //                 'key': 'notification을 구분하는 유일한 키값',
    //                 'title': 'notification title',
    //                 'body': 'notification body',
    //                 'data': 'notification title',
    //                 'img': 'notification 이미지 url, 안드로이드에서만 가능',
    //                 'isStored': 'notification-box에 저장할지 여부',
    //                 'isOption': '유저 switch option에 표시할 지 여부',
    //                 'description': 'notification이 왔을때 바로 보이는 설명 문구'
    //             },
    //             defaults: {},
    //             response: resforms.notification,
    //             title: '노티피케이션 등록',
    //             state: 'development'
    //         };
    //
    //         if (!isOnlyParams) {
    //             var apiCreator = new HAPICreator(req, res, next);
    //
    //             apiCreator.add(req.middles.session.loggedInRole(STD.user.roleSupervisor));
    //             apiCreator.add(req.middles.validator(
    //                 params.acceptable,
    //                 params.essential,
    //                 params.resettable
    //             ));
    //             apiCreator.add(post.validate());
    //             apiCreator.add(post.setParam());
    //             apiCreator.add(post.supplement());
    //             apiCreator.run();
    //         }
    //         else {
    //             return params;
    //         }
    //     };
    // },
    // put: function (isOnlyParams) {
    //     return function (req, res, next) {
    //
    //         var params = {
    //             acceptable: ['type', 'title', 'body', 'data', 'img', 'isStored', 'isOption', 'description'],
    //             essential: ['type', 'title', 'body', 'data', 'img', 'isStored', 'isOption', 'description'],
    //             resettable: [],
    //             explains: {
    //                 'key': 'notification을 구분하는 유일한 키값',
    //                 'type': 'notification type ' + STD.notification.enumPublicNotificationTypes.join(", "),
    //                 'title': 'notification title',
    //                 'body': 'notification body',
    //                 'data': 'notification title',
    //                 'img': 'notification 이미지 url, 안드로이드에서만 가능',
    //                 'isStored': 'notification-box에 저장할지 여부',
    //                 'isOption': '유저 switch option에 표시할 지 여부',
    //                 'description': 'notification이 왔을때 바로 보이는 설명 문구'
    //             },
    //             param: 'key',
    //             response: resforms.notification,
    //             role: STD.role.account,
    //             title: '노티피케이션 수정',
    //             state: 'development'
    //         };
    //
    //         if (!isOnlyParams) {
    //             var apiCreator = new HAPICreator(req, res, next);
    //
    //             apiCreator.add(req.middles.session.loggedInRole(STD.user.roleSupervisor));
    //             apiCreator.add(req.middles.validator(
    //                 params.acceptable,
    //                 params.essential,
    //                 params.resettable
    //             ));
    //             apiCreator.add(put.validate());
    //             apiCreator.add(top.hasAuthorization());
    //             apiCreator.add(put.updateReport());
    //             apiCreator.add(put.supplement());
    //             apiCreator.run();
    //
    //
    //         }
    //         else {
    //             return params;
    //         }
    //     };
    // },
    delete: function (isOnlyParams) {
        return function (req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'key': 'notification을 구분하는 유일한 키값'
                },
                role: STD.role.account,
                title: '노티피케이션 제거',
                param: 'key',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleSupervisor));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(top.hasAuthorization());
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:key', api.get());
// router.get('/' + resource, api.gets());
// router.post('/' + resource, api.post());
// router.put('/' + resource + '/:key', api.put());
router.delete('/' + resource + '/:key', api.delete());

module.exports.router = router;
module.exports.api = api;