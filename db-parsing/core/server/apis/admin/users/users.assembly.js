"use strict";

var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

var META = require('../../../../../bridge/metadata');
var STD = META.std;
var USER = STD.user;

var api = {
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['searchItem', 'searchField', 'last', 'size', 'orderBy', 'sort', 'role', 'gender'],
                essential: [],
                resettable: [],
                explains: {
                    searchItem: '검색할 내용',
                    searchField: '검색할 필드 ' + STD.user.enumSearchFields.join(", "),
                    last: '마지막 데이터',
                    size: '몇개 로드할지에 대한 사이즈',
                    orderBy: '정렬 기준 필드 ' + STD.user.enumOrders.join(", "),
                    sort: '정렬 순서 ' + STD.common.enumSortTypes.join(", "),
                    role: '유저 권한 ' + STD.user.enumRoles.join(", "),
                    gender: '성별 ' + STD.user.enumGenders.join(", ")
                },
                response: {rows: [resforms.user]},
                role: STD.user.roleAdmin,
                title: '유저 리스트 얻기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(req.middles.session.hasAuthorization());
                apiCreator.add(gets.validate());
                apiCreator.add(gets.getUsers());
                apiCreator.add(gets.supplement());
                apiCreator.run();

            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.gets());

module.exports.router = router;
module.exports.api = api;