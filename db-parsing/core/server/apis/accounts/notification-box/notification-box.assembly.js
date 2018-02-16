var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');
var put = require('./' + resource + '.put.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms/index');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [
                    'userId',
                    'last',
                    'size',
                    'offset',
                    'key'
                ],
                essential: [],
                resettable: [],
                explains: {
                    'userId': '유저 id',
                    'last': '조회 기준 마지막 데이터',
                    'size': '가져올 데이터 크기',
                    'offset': 'offset',
                    'key': '조회할 key (,)로 구분'
                },
                response: {
                    rows: [resforms.notification]
                },
                // role: STD.role.account,
                title: '노티피케이션 알림내용 전체 얻기',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(top.hasAuthorizationForQuery());
                // apiCreator.add(req.middles.role.userIdChecker('query', 'userId', STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.setParam());
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
                acceptable: ['id'],
                essential: [],
                resettable: [],
                explains: {},
                // role: STD.role.account,
                title: '노티피케이션 읽음표시, id가 있을경우 해당 id만 읽음표시',
                state: 'design'
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
                apiCreator.add(put.updateNotificationBox());
                apiCreator.add(put.supplement());
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
                acceptable: [
                    'userId'
                ],
                essential: [],
                resettable: [],
                explains: {},
                // role: STD.role.account,
                title: '노티피케이션 알림상자 제거',
                param: 'id',
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

router.get('/' + resource, api.gets());
router.put('/' + resource, api.put());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;