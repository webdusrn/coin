var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var put = require('./' + resource + '.put.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    put: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['articleId', 'slug', 'categoryId'],
                essential: ['articleId', 'slug', 'categoryId'],
                resettable: [],
                explains: {
                    'articleId': '게시글 아이디',
                    'slug': '게시판 slug',
                    'categoryId': '카테고리 아이디'
                },
                title: '보기 증가',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.loadBoard());
                apiCreator.add(put.updateArticle());
                apiCreator.add(put.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.put('/' + resource, api.put());

module.exports.router = router;
module.exports.api = api;