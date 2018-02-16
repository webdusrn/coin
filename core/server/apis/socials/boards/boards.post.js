var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var BOARD = req.meta.std.board;

        var requestAPI = req.coreUtils.common.requestAPI(req, res, next);
        requestAPI({
            resource: '/socials/skins',
            method: 'gets',
            data: {},
            params: {}
        }, function (status, data) {

            if (status == 200) {
                req.check('slug', '400_8').isAlphanumeric().len(BOARD.minSlugLength, BOARD.maxSlugLength);
                req.utils.common.toArray(req.body, 'categories');

                req.check('skin', '400_3').isEnum(data);

                if (req.body.roleRead !== undefined) {
                    req.check('roleRead', '400_3').isEnum(req.meta.std.user.enumRoles);
                }

                if (req.body.roleWrite !== undefined) {
                    req.check('roleWrite', '400_3').isEnum(req.meta.std.user.enumRoles);
                }

                if (req.body.isVisible !== undefined) {
                    req.check('isVisible', '400_20').isBoolean();
                    req.sanitize('isVisible').toBoolean();
                }

                if (req.body.isAnonymous !== undefined) {
                    req.check('isAnonymous', '400_20').isBoolean();
                    req.sanitize('isAnonymous').toBoolean();
                }

                req.utils.common.checkError(req, res, next);
            } else {
                return res.hjson(req, next, status, data);
            }

        });

    };
};

post.createBoard = function () {
    return function (req, res, next) {
        req.models.Board.createBoardWithCategories(req.body, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
