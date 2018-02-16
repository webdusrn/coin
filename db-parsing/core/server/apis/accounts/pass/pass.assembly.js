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
    put : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['token', 'newPass', 'type', 'email'],
                essential: ['token', 'newPass', 'type'],
                resettable: [],
                explains : {
                    'type': STD.user.enumLinkIdPassTypes.join(", "),
                    'token': "normal타입의 경우 기존 비밀번호, email타입의 경우 token값",
                    "email": "email 타입의 경우에만 유효함",
                    'newPass': '새로운 비밀번호'
                },
                title: '비밀번호 변경',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.checkToken());
                apiCreator.add(put.loadUser());
                apiCreator.add(put.changePassword());
                apiCreator.add(put.removeAuth());
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