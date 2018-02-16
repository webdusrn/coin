var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['type', 'email', 'successRedirect', 'errorRedirect'],
                essential: ['type', 'email'],
                resettable: [],
                explains : {
                    'type': '이메일 발송 타입 ' + STD.user.enumAuthEmailTypes.join(", "),
                    'email': '이메일',
                    'successRedirect': '인증 성공 후 리다이렉트될 경로',
                    'errorRedirect': '인증 실패 후 리다이렉트될 경로'
                },
                title: '타입별 이메일 전송자',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.additionalValidate());
                apiCreator.add(post.loadEmailUser());
                apiCreator.add(post.upsertAuth());
                apiCreator.add(post.sendEmailAuth());
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