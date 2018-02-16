var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var async = require('async');

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_17').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

del.removeAllSessions = function () {
    return function (req, res, next) {
        req.coreUtils.session.removeAllLoginHistoriesAndSessions(req, req.params.id, function (status, data) {
            if (status == 204 || status == 404) {
                next();
            }
            else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

del.destroyUser = function () {
    return function (req, res, next) {

        // function sample(t, callback) {
        //     return req.models.Report.destroy({
        //         where: {id: 1},
        //         transaction: t
        //     }).then(function (data) {
        //         console.log('Report.destroy', data);
        //         callback(t);
        //     });
        // }

        //스탠다드 replaceApi에 userDel 있으면 해당 api 호출
        if (req.meta.std.replaceApi.userDel) {

            var requestAPI = req.coreUtils.common.requestAPI(req, res, next);
            requestAPI({
                resource: req.meta.std.replaceApi.userDel,
                method: 'delete',
                data: req.body,
                params: {
                    id: req.params.id
                }
            }, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });

        } else {
            req.models.User.destroyUser(req.params.id, null, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    res.hjson(req, next, status, data);
                }
            });
        }

    };
};

del.deleteOptionalTerms = function () {
    return function (req, res, next) {

        req.models.OptionalTerms.deleteOptionalTermsByUserId(req.params.id, function (status, data) {
            next();
        });

    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;