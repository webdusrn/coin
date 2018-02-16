var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var put = require('./' + resource + '.put.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata');
const STD = META.std;

var isTestMode = process.env.NODE_ENV == 'test';

var api = {
    put: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['userId', 'role'],
                essential: ['userId', 'role'],
                resettable: [],
                explains: {
                    'userId': '유저아이디',
                    'role': STD.user.enumRoles.join(", ")
                },
                role: isTestMode ? 'null' : STD.user.roleAdmin,
                title: '권한 수정',
                state: 'staging'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                if (!isTestMode) {
                    apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                }
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.updateUser());
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