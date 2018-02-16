var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var BOARD = req.meta.std.board;
        req.check('slug', '400_8').isAlphanumeric().len(BOARD.minSlugLength, BOARD.maxSlugLength);

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
    };
};

put.updateBoard = function () {
    return function (req, res, next) {
        req.models.Board.updateBoardBySlug(req.params.slug, req.body, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, {object: req.data});
    };
};

module.exports = put;
