var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['slug', 'categoryId', 'articleId', 'last', 'size', 'nick', 'title'],
                essential: ['slug'],
                resettable: [],
                explains : {
                    'slug': '보드 slug',
                    'categoryId': '카테고리 아이디',
                    'articleId': '게시글 아이디'
                },
                title: '게시판의 정보얻기, slug만 있으면 전체글, categoryId도 있으면 카테고리별 글, articleId가 있으면 단일 아티클 모두 공통인터페이스로 얻어옴.',
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
                apiCreator.add(get.loadArticles());
                apiCreator.add(get.loadNoticeArticles());
                apiCreator.add(get.countArticles());
                apiCreator.add(get.countComments());
                apiCreator.add(get.countCommentsForEachArticles());
                apiCreator.add(get.loadComments());
                apiCreator.add(get.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.get());

module.exports.router = router;
module.exports.api = api;