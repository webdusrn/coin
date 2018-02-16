var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');
var put = require('./' + resource + '.put.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['userId', 'sendType'],
                essential: ['userId', 'sendType'],
                resettable: [],
                explains: {
                    'userId': '유저 id',
                    'sendType': '알림 전송 형태 ' + STD.notification.enumSendTypes.join(',')
                },
                response: {rows: [resforms.notification]},
                title: '알림 전체 얻기',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(top.hasAuthorization());
                // apiCreator.add(req.middles.role.userIdChecker('query', 'userId', STD.role.account));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.getNotificationSwitch());
                apiCreator.add(gets.supplement());
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
                acceptable: ['userId', 'key', 'sendType', 'switch'],
                essential: ['userId', 'key', 'sendType', 'switch'],
                resettable: [],
                explains: {
                    'userId': '유저 id',
                    'key': "노티피케이션 키",
                    'sendType': "노티피케이션 알림 종류 " + STD.notification.enumSendTypes,
                    'switch': '스위치 on/off'
                },
                response: resforms.notification,
                title: '알림 수신 설정',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.validateKey());
                apiCreator.add(put.updateNotificationSwitch());
                apiCreator.add(put.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.gets());
router.put('/' + resource, api.put());

module.exports.router = router;
module.exports.api = api;