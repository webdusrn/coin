var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var get = require('./' + resource + '.get.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['type', 'majorVersion', 'minorVersion', 'hotfixVersion'],
                essential: ['type', 'majorVersion', 'minorVersion', 'hotfixVersion'],
                resettable: [],
                explains: {
                    'type': '모바일 플랫폼 ' + STD.mobile.enumOsType.join(", "),
                    'majorVersion': '기기의 메이저 버전',
                    'minorVersion': '기기의 마이너 버전',
                    'hotfixVersion': '기기의 핫픽스 버전'
                },
                title: '모바일 버전 얻기',
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
                apiCreator.add(get.setParams());
                apiCreator.add(get.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['type', 'majorVersion', 'minorVersion', 'hotfixVersion', 'forceUpdate'],
                essential: ['type', 'majorVersion', 'minorVersion', 'hotfixVersion', 'forceUpdate'],
                resettable: [],
                explains: {
                    'type': '모바일 플랫폼 ' + STD.mobile.enumOsType.join(", "),
                    'majorVersion': '기기의 메이저 버전',
                    'minorVersion': '기기의 마이너 버전',
                    'hotfixVersion': '기기의 핫픽스 버전',
                    'forceUpdate': '강제업데이트 여부'
                },
                title: '모바일 버전 갱신',
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
                apiCreator.add(post.validate());
                apiCreator.add(post.setParams());
                apiCreator.add(post.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.get());
router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;