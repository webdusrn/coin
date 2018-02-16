"use strict";

var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var put = require('./' + resource + '.put.js');
var get = require('./' + resource + '.get.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

var META = require('../../../../../bridge/metadata');
var STD = META.std;
var USER = STD.user;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                },
                response: {},
                title: '단일 얻기',
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
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
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
                acceptable: ['companyName', 'representative', 'regNum', 'privateInfoManager', 'communicationsRetailReport', 'address', 'contact', 'contact2', 'fax', 'email'],
                essential: ['companyName', 'representative', 'regNum', 'privateInfoManager', 'address'],
                resettable: ['communicationsRetailReport', 'contact', 'contact2', 'fax', 'email'],
                explains: {
                    'companyName': '회사이름',
                    'representative': '대표자',
                    'regNum': '사업자등록번호',
                    'privateInfoManager': '개인정보보호관리자',
                    'address': '회사주소',
                    'contact': '연락처'
                },
                defaults: {},
                role: STD.user.roleAdmin,
                title: '회사정보쓰기',
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
                apiCreator.add(put.validate());
                apiCreator.add(put.setParam());
                apiCreator.add(put.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
};

router.get('/' + resource, api.get());
router.put('/' + resource, api.put());

module.exports.router = router;
module.exports.api = api;