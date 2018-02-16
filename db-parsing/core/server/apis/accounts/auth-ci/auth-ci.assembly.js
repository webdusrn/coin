var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['type', 'userId', 'ci', 'di', 'transactionNo', 'name', 'birthYear', 'birthMonth', 'birthDay', 'gender', 'phoneNum'],
                essential: ['type', 'ci', 'name', 'birthYear', 'birthMonth', 'birthDay', 'gender', 'phoneNum'],
                resettable: [],
                explains: {
                    'type': STD.user.enumAuthType.join(','),
                    'userId': '유저 id',
                    'ci': 'ci 값',
                    'di': 'di 값',
                    'transactionNo': '거래번호',
                    'name': '이름',
                    'birthYear': '생일 년',
                    'birthMonth': '생일 년',
                    'birthDay': '생일 년',
                    'gender': '성별',
                    'phoneNum': '핸드폰번호'
                },
                title: '본인인증',
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
                apiCreator.add(post.setParams());
                apiCreator.add(post.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    },
};

router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;