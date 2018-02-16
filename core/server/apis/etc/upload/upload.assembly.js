var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');

var async = require('async');


const META = require('../../../../../bridge/metadata/index');
const STD = META.std;
var config = require('../../../config/env/index');

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['folder'],
                    essential: ['folder'],
                resettable: [],
                explains : {
                    'folder': '업로드할 폴더'
                },
                title: '파일 업로드',
                file: 'file',
                files_cnt: 5,
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);
                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.upload.refineFiles());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(req.middles.upload.checkInvalidFileType(STD.file.enumInvalidFileExtensions));
                apiCreator.add(req.middles.upload.createPrefixName());
                apiCreator.add(req.middles.upload.checkFileCount(STD.file.minCount, STD.file.maxCount));
                apiCreator.add(req.middles.upload.storeFiles());
                apiCreator.add(post.supplement());
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
                acceptable: ['folder', 'file'],
                essential: ['folder', 'file'],
                resettable: [],
                explains : {
                    'file': '지울 파일 이름',
                    'folder': '지울 파일이 있는 폴더'
                },
                title: '파일 제거',
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
                apiCreator.add(del.checkSession());
                apiCreator.add(del.validate());
                apiCreator.add(req.middles.upload.deleteFiles());
                apiCreator.add(del.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.post('/' + resource, api.post());
router.delete('/' + resource, api.delete());

module.exports.router = router;
module.exports.api = api;