var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var put = require('./' + resource + '.put.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    put : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ["userId", "contents"],
                essential: ["userId"],
                resettable: ["contents"],
                explains : {
                    "userId": "유저아이디",
                    "contents": "수정할 데이터"
                },
                title: '자기소개 수정',
                state: 'development'
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
                apiCreator.add(put.updateProfile());
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