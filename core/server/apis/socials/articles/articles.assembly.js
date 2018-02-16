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
                acceptable: ['slug', 'categoryId'],
                essential: ['slug', 'categoryId'],
                resettable: [],
                explains : {
                    'id': '데이터를 얻을 리소스의 id',
                    'slug': '보드 slug',
                    'categoryId': '카테고리아이디'
                },
                param: 'id',
                title: '게시글 단일 얻기',
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
                apiCreator.add(get.loadBoard());
                apiCreator.add(get.countComments());
                apiCreator.add(get.loadComments());
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
                acceptable: ['slug', 'categoryId', 'authorId', 'last', 'size', 'loadType', 'nick', 'title'],
                essential: ['slug'],
                resettable: [],
                explains : {
                    'authorId': '작성자 아이디',
                    'slug': '게시판 slug',
                    'categoryId': '카테고리 아이디',
                    'last': '마지막 데이터',
                    'size': '몇개 로드할지에 대한 사이즈',
                    'loadType': '블로그 혹은 게시판 형태 로딩방식 기본은 page방식 ' + STD.common.enumLoadTypes.join(", "),
                    'nick': '닉네임으로 검색',
                    'title': '제목으로 검색'
                },
                title: '게시글 얻기',
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
                apiCreator.add(gets.loadBoard());
                apiCreator.add(gets.loadArticles());
                apiCreator.add(gets.countArticles());
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
                acceptable: ['slug', 'categoryId', 'title', 'body', 'img', 'lat', 'lng', 'isVisible', 'isNotice', 'country'],
                essential: ['slug', 'categoryId', 'title', 'body'],
                resettable: [],
                explains : {
                    'slug': '게시판 slug',
                    'categoryId': '카테고리 아이디',
                    'title': '게시글 제목',
                    'body': '게시글 내용',
                    'img': '겔러리일 경우 메인이미지',
                    'lat': '위도',
                    'lng': '경도',
                    'isVisible': '게시글 노출여부',
                    'isNotice': '공지사항여부',
                    'country': '국가'
                },
                defaults: {

                },
                title: '게시글작성',
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
                apiCreator.add(post.validate());
                apiCreator.add(post.loadBoard());
                apiCreator.add(post.createArticle());
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
                acceptable: ['slug', 'categoryId', 'title', 'body', 'img', 'lat', 'lng', 'isVisible', 'isNotice', 'country'],
                essential: [],
                resettable: ['lat', 'lng'],
                explains : {
                    'slug': '해당 글의 게시판 자체를 이동할때 쓰일 보드 slug',
                    'categoryId': '해당글의 카테고리를 옮길때 쓰일 카테고리 아이디',
                    'id': '데이터 리소스의 id',
                    'img': '겔러리일경우 메인 이미지 경로',
                    'title': '게시글 제목',
                    'body': '게시글 내용',
                    'lat': '위도',
                    'lng': '경도',
                    'isVisible': '게시글 노출여부',
                    'isNotice': '공지사항여부',
                    'country': '국가'
                },
                title: '수정',
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
                apiCreator.add(put.validate());
                apiCreator.add(top.hasAuthorization());
                apiCreator.add(put.loadBoard());
                apiCreator.add(put.updateArticle());
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
                    'id': '데이터 리소스의 id'
                },
                title: '제거',
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

router.get('/' + resource + '/:id', api.get());
router.get('/' + resource, api.gets());
router.post('/' + resource, api.post());
router.put('/' + resource + '/:id', api.put());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;