var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [
                    'key'
                ],
                essential: [],
                resettable: [],
                explains: {
                    'key': 'notification box key (,)로 구분 가능'
                },
                title: '새로운 알림/채팅 조회',
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
                apiCreator.add(gets.validate());
                apiCreator.add(gets.getNewNotificationCount());
                apiCreator.add(gets.getNewChatMessageCount());
                apiCreator.add(gets.supplement());
                apiCreator.run();

            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource, api.gets());

module.exports.router = router;
module.exports.api = api;