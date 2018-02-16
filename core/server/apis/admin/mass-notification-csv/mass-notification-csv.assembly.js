var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');
var resforms = require('../../../resforms');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api = {
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [
                    "folder",
                    "sendType",
                    "sendMethod",
                    "notificationName",
                    "messageTitle",
                    "messageBody"
                ],
                essential: [
                    "sendType",
                    "notificationName",
                    "messageBody"
                ],
                resettable: [],
                explains: {
                    "folder": "mms 이미지 저장될 폴더" + STD.file.folderNotification,
                    "sendType": STD.notification.enumSendTypes.join(", "),
                    "sendMethod": STD.notification.enumSendMethods.join(", "),
                    "notificationName": "전송 제목",
                    "messageTitle": "메세지 제목",
                    "messageBody": "메세지 내용"
                },
                role: STD.user.roleAdmin,
                title: 'csv 메세지 전송',
                file: 'file',
                files_cnt: 2,
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.upload.refineFiles());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(req.middles.upload.checkFileFormat(STD.file.enumValidCsvExtensions.concat(STD.file.enumValidImageExtensions)));
                apiCreator.add(req.middles.upload.checkInvalidFileType(STD.file.enumInvalidFileExtensions));
                apiCreator.add(req.middles.upload.checkFileCount(1, 2));
                apiCreator.add(req.middles.upload.reorderByExtension('csv'));
                apiCreator.add(post.validate());
                apiCreator.add(post.checkNCreatePart());
                apiCreator.add(post.series());
                apiCreator.add(post.supplement());
                apiCreator.run();

                delete apiCreator;
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