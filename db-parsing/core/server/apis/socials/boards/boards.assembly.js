"use strict";

var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var put = require('./' + resource + '.put.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains : {
                    'slug': '데이터를 얻을 리소스의 slug'
                },
                param: 'slug',
                title: '단일 얻기',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.loadBoard());
                apiCreator.add(get.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    },
    gets : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['searchItem', 'searchField','last', 'size', 'isVisible', 'isAnonymous', 'sort'],
                essential: [],
                resettable: [],
                explains : {
                    searchItem: '검색할 내용',
                    searchField: '검색할 항목',
                    last: '마지막 데이터',
                    size: '몇개 로드할지에 대한 사이즈',
                    isVisible: '인증 여부',
                    isAnonymous: '익명 게시판 여부',
                    sort: '정렬 순서 ' + STD.common.enumSortTypes.join(", ")
                },
                title: '신고리스트얻기',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

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
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['slug', 'skin', 'roleRead', 'roleWrite', 'isVisible', 'isAnonymous', 'categories'],
                essential: ['slug', 'skin', 'categories'],
                resettable: [],
                explains : {
                    'slug': '영문 이름',
                    'skin': '스킨명',
                    'categories': '카테고리 이름 배열, 컴마로 구분',
                    'roleRead': '읽기권한 (해당권한이상) ' + META.std.user.enumRoles.join(", "),
                    'roleWrite': '쓰기권한 (해당권한이상) ' + META.std.user.enumRoles.join(", "),
                    'isVisible': '게시판을 숨길지 여부. true, false',
                    'isAnonymous': '익명게시판여부. true, false'
                },
                title: '게시판만들기',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(META.std.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.createBoard());
                apiCreator.add(post.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    put : function(isOnlyParams) {
        return function(req, res, next) {
            
            var params = {
                acceptable: ['skin', 'roleRead', 'roleWrite', 'isVisible', 'isAnonymous'],
                essential: [],
                resettable: [],
                explains : {
                    'slug': '게시판 slug',
                    'skin': '스킨명',
                    'roleRead': '읽기권한 (해당권한이상) ' + META.std.user.enumRoles.join(", "),
                    'roleWrite': '쓰기권한 (해당권한이상) ' + META.std.user.enumRoles.join(", "),
                    'isVisible': '게시판을 숨길지 여부. true, false',
                    'isAnonymous': '익명게시판여부. true, false'
                },
                title: '게시판수정',
                param: 'slug',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(META.std.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.updateBoard());
                apiCreator.add(put.supplement());
                apiCreator.run();

                
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
                explains : {
                    'slug': '데이터 리소스의 slug'
                },
                title: '제거',
                param: 'slug',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(META.std.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(del.destroyBoard());
                apiCreator.add(del.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:slug', api.get());
router.get('/' + resource, api.gets());
router.post('/' + resource, api.post());
router.put('/' + resource + '/:slug', api.put());
router.delete('/' + resource + '/:slug', api.delete());

module.exports.router = router;
module.exports.api = api;