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

var config = require('../../../../../bridge/config/env');
const META = require('../../../../../bridge/metadata/index');
const STD = META.std;
const IMAGE = STD.image;
const FILE = STD.file;
const COMMON = STD.common;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains : {
                    'id': '데이터를 얻을 리소스의 id'
                },
                response: {

                },
                param: 'id',
                title: '단일 얻기',
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
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['searchItem', 'searchField', 'searchItemUser', 'searchFieldUser', 'authorId', 'last', 'size', 'orderBy', 'sort', 'folder', 'authorized'],
                essential: [],
                resettable: [],
                explains: {
                    searchItem: '검색할 내용',
                    searchField: '검색할 필드' + STD.image.enumSearchFields.join(", "),
                    searchItemUser: '검색할 내용 유저',
                    searchFieldUser: '검색할 필드 유저' + STD.image.enumSearchFieldsUser.join(", "),
                    authorId: '작성자 id',
                    last: '마지막 데이터',
                    size: '몇개 로드할지에 대한 사이즈',
                    orderBy: '정렬 옵션 ex) ' + IMAGE.enumOrders.join(", "),
                    sort: '정렬 순서 ex) ' + COMMON.enumSortTypes.join(", "),
                    folder: '폴더명 ex) ' + FILE.enumFolders.join(", "),
                    authorized: '인증, 비인증 여부'
                },
                response: {

                },
                role: STD.user.roleAdmin,
                title: '오디오 리스트 얻기',
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
                apiCreator.add(gets.validate());
                apiCreator.add(gets.getAudios());
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
                acceptable: ['folder', 'offsetX', 'offsetY', 'width', 'height'],
                essential: ['folder'],
                resettable: [],
                explains : {
                    'folder': '오디오를 올릴 폴더 ' + FILE.enumAudioFolders.join(", "),
                    'offsetX': 'x 위치',
                    'offsetY': 'y 위치',
                    'width': '너비',
                    'height': '높이'
                },
                response: {
                    
                },
                title: '오디오 업로드',
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
                apiCreator.add(req.middles.upload.generateFolder(FILE.folderAudios));
                apiCreator.add(req.middles.upload.checkFileFormat(FILE.enumValidAudioExtensions));
                apiCreator.add(req.middles.upload.checkFileCount(FILE.minCount, FILE.maxCount));
                apiCreator.add(req.middles.upload.storeFiles());
                apiCreator.add(post.bulkCreate());
                apiCreator.add(post.getAudios());
                apiCreator.add(post.supplement());
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
                acceptable: ['authorized'],
                essential: [],
                resettable: [],
                explains: {
                    'authorized': '인증/비인증'
                },
                response: {

                },
                role: STD.user.roleAdmin,
                title: '오디오 인증/비인증 수정',
                param: 'id',
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
                apiCreator.add(put.updateAudio());
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
                acceptable: ['folder', 'audioIds'],
                essential: ['folder', 'audioIds'],
                resettable: [],
                explains : {
                    'folder': '지울 오디오 폴더',
                    'audioIds': '지울 오디오 아이디 ex) 1,2'
                },
                response: {

                },
                title: '오디오 파일 제거',
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
                apiCreator.add(del.getAudios());
                apiCreator.add(del.checkSession());
                apiCreator.add(del.setParam());
                apiCreator.add(req.middles.upload.deleteFiles());
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
router.delete('/' + resource, api.delete());

module.exports.router = router;
module.exports.api = api;