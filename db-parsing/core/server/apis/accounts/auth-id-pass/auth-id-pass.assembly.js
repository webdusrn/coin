var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['type', 'id', 'pass'],
                essential: ['type', 'id', 'pass'],
                resettable: [],
                explains : {
                    'type': STD.user.enumLinkIdPassTypes.join(", "),
                    'id': '이메일아이디 혹은 일반 아이디', 
                    'pass': '비밀번호'
                },
                defaults: {
                    'type': STD.user.linkIdPassEmail,
                    'id': 'admin@slogup.com',
                    'pass': '123qwe'
                },
                response: resforms.user,
                title: '아이디 패스워드 연동',
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
                apiCreator.add(post.updateAccount());
                apiCreator.add(post.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }
};

router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;