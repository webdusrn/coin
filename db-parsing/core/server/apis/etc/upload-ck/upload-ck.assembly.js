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
var config = require('../../../../../bridge/config/env');
const FILE = STD.file;

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['CKEditor', 'CKEditorFuncNum', 'langCode'],
                essential: ['CKEditor', 'CKEditorFuncNum', 'langCode'],
                resettable: [],
                explains : {
                    'CKEditor': '에디터이름',
                    'CKEditorFuncNum': '에디터콜백함수번호',
                    'langCode': '언어코드'
                },
                title: 'CKEditor 전용 파일 업로드',
                file: 'file',
                files_cnt: 1,
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
                apiCreator.add(req.middles.upload.generateFolder(FILE.folderImages));
                apiCreator.add(req.middles.upload.checkFileFormat(FILE.enumValidImageExtensions));
                apiCreator.add(req.middles.upload.checkFileCount(FILE.minCount, FILE.maxCount));
                apiCreator.add(req.middles.upload.createPrefixName());
                apiCreator.add(req.middles.upload.createResizeOptions());
                apiCreator.add(req.middles.upload.normalizeImages());
                apiCreator.add(req.middles.upload.storeFiles());
                apiCreator.add(post.create());
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
                acceptable: ['folder', 'files'],
                essential: ['folder', 'files'],
                resettable: [],
                explains : {
                    'files': '지울 파일 이름',
                    'folder': '지울 파일이 있는 폴더'
                },
                title: '파일 제거',
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