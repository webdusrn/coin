var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;
const NOTIFICATIONS = META.notifications;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터를 얻을 리소스의 id'
                },
                response: {},
                role: STD.user.roleAdmin,
                param: 'id',
                title: '단일 얻기',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    gets : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    "searchField",
                    "searchItem",
                    "orderBy",
                    "sort",
                    "last",
                    "size",
                    "key",
                    "sendType",
                    "isStored"
                ],
                essential: [],
                resettable: [],
                explains: {
                    "searchField": "검색 필드 " + STD.notification.enumSearchFields.join(", "),
                    "searchItem": "검색 내용",
                    "orderBy": "정렬 기준 필드 " + STD.notification.enumOrderBys.join(", "),
                    "sort": "정렬 방식 " + STD.common.enumSortTypes.join(", "),
                    "last": "조회 기준 데이터 일자",
                    "size": "가져올 데이터 갯수",
                    "key": "전송 유형 " + Object.keys(NOTIFICATIONS.public).join(", "),
                    "sendType": "전송 방식 " + STD.notification.enumSendTypes.join(", "),
                    "isStored": "Box 저장 여부 true, false"
                },
                response: {
                    count: 0,
                    rows: []
                },
                role: STD.user.roleAdmin,
                title: '전송관리 조회',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.setParam());
                apiCreator.add(gets.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    delete : function(isOnlyParams) {
        return function(req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터 리소스의 id'
                },
                role: STD.user.roleAdmin,
                title: '전송관리 제거',
                param: 'id',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:id', api.get());
router.get('/' + resource, api.gets());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;