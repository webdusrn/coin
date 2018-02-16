/**
 * Report model module.
 * @module core/server/models/sequelize/report
 */

var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');

var mixin = require('./mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var micro = require('microtime-nodejs');
var config = require('../../../../bridge/config/env');
var coreUtils = require("../../../../core/server/utils");

module.exports = {
    fields: {
        'body': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false
        },
        'email': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'authorId': {
            reference: 'User',
            referenceKey: 'id',
            as: 'author',
            asReverse: 'reports',
            allowNull: true
        },
        'nick': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'reply': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        // 'isSolved': {
        //     'type': Sequelize.BOOLEAN,
        //     'allowNull': false,
        //     'defaultValue': false
        // },
        'solvedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    options: {
        'timestamps': true,
        'charset': config.db.charset,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true, // deletedAt 추가. delete안함.
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getReportInclude': function () {
                return [{
                    'model': sequelize.models.User,
                    'as': 'author',
                    'attributes': sequelize.models.User.getFullUserFields(),
                    'include': [{
                        'model': sequelize.models.UserImage,
                        'as': 'userImages',
                        'include': {
                            'model': sequelize.models.Image,
                            'as': 'image'
                        }
                    }, {
                        'model': sequelize.models.LoginHistory,
                        'as': 'loginHistories'
                    }]
                }];
            },
            'findReportsByOptions': function (options, callback) {
                var where = {};

                if (options.authorId !== undefined) where.authorId = options.authorId;
                if (options.isSolved !== undefined) {
                    where.solvedAt = options.isSolved ? {
                        $not: null
                    } : null;
                }

                if (options.searchField && options.searchItem) {

                    if (options.searchField == STD.common.id) {
                        where[options.searchField] = options.searchItem;
                    } else {
                        where[options.searchField] = {
                            '$like': '%' + options.searchItem + '%'
                        };
                    }

                } else if (options.searchItem) {
                    if (STD.report.enumSearchFields.length > 0) where.$or = [];

                    for (var i = 0; i < STD.report.enumSearchFields.length; i++) {
                        var body = {};

                        if (STD.report.enumSearchFields[i] == STD.common.id) {
                            body[STD.report.enumSearchFields[i]] = options.searchItem;
                        } else {
                            body[STD.report.enumSearchFields[i]] = {
                                '$like': '%' + options.searchItem + '%'
                            };
                        }

                        where.$or.push(body);
                    }
                }

                where.createdAt = {
                    '$lt': options.last
                };

                var reports = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Report.findAll({
                        'limit': parseInt(options.size),
                        'where': where,
                        'order': [['createdAt', options.sort]],
                        'include': sequelize.models.Report.getReportInclude(),
                        'transaction': t
                    }).then(function (data) {
                        if (data.length > 0) {
                            reports.rows = data;
                            delete where.createdAt;
                            return sequelize.models.Report.count({
                                'where': where,
                                'transaction': t
                            });

                        } else {
                            throw new errorHandler.CustomSequelizeError(404);
                        }
                    }).then(function (count) {
                        reports.count = count;

                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, reports);
                    }
                });
            },
            'findReportById': function (id, callback) {
                sequelize.models.Report.findDataById(id, callback);
            },
            'getReportsStatus': function (timeZoneOffset, year, month, day, callback) {

                //오늘 날짜 구하기
                // var today = new Date();
                // var year = today.getFullYear();
                // var month = today.getMonth() + 1;
                // var day = today.getDate();
                //
                // var timeZoneOffset = '+09:00';

                var reportsStatus = {};

                sequelize.transaction(function (t) {

                    return sequelize.models.Report.count({
                        transaction: t
                    }).then(function (reportsTotal) {
                        reportsStatus.total = reportsTotal;

                        return sequelize.models.Report.count({
                            where: {
                                solvedAt: {
                                    $not: null
                                }
                            },
                            transaction: t
                        });

                    }).then(function (reportsSolved) {
                        reportsStatus.solved = reportsSolved;

                        var query = 'SELECT count(day) as count FROM (SELECT ' +
                            'YEAR(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, ' +
                            'MONTH(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month, ' +
                            'DAY(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as day FROM Reports) as Reports ' +
                            'WHERE year = ' + year + ' AND month = ' + month + ' AND day = ' + day;

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true
                        });

                    }).then(function (data) {
                        reportsStatus.reportsToday = data[0].count;

                        var query = 'SELECT count(day) as count FROM (SELECT ' +
                            'YEAR(CONVERT_TZ(FROM_UNIXTIME(solvedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, ' +
                            'MONTH(CONVERT_TZ(FROM_UNIXTIME(solvedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month, ' +
                            'DAY(CONVERT_TZ(FROM_UNIXTIME(solvedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as day FROM Reports) as Reports ' +
                            'WHERE year = ' + year + ' AND month = ' + month + ' AND day = ' + day;

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true
                        });

                    }).then(function (data) {
                        reportsStatus.solvedToday = data[0].count;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, reportsStatus);
                    }
                });

            },
            'getReportsStatusByMonth': function (timeZoneOffset, year, month, day, callback) {

                var monthKey = '_month';

                // var today = new Date();
                // var year = today.getFullYear();
                // var month = today.getMonth() + 1;

                var thisYearMonths = [];
                var lastYearMonths = [];

                for (var i = 0; i < 5; i++) {
                    if (month <= 0) {
                        lastYearMonths.push(12 + month--);
                    } else {
                        thisYearMonths.push(month--);
                    }
                }

                var thisYear = year;
                var lastYear = year - 1;

                var reportsStatusByMonth = {
                    createdReports: {},
                    solvedReports: {}
                };

                thisYearMonths.forEach(function (thisMonth) {
                    reportsStatusByMonth.createdReports[thisMonth + monthKey] = {
                        month: thisMonth,
                        count: 0
                    };

                    reportsStatusByMonth.solvedReports[thisMonth + monthKey] = {
                        month: thisMonth,
                        count: 0
                    };
                });

                lastYearMonths.forEach(function (lastMonth) {
                    reportsStatusByMonth.createdReports[lastMonth + monthKey] = {
                        month: lastMonth,
                        count: 0
                    };
                    reportsStatusByMonth.solvedReports[lastMonth + monthKey] = {
                        month: lastMonth,
                        count: 0
                    };
                });

                var result = {
                    createdReports: [],
                    solvedReports: []
                };

                sequelize.transaction(function (t) {

                    var query;

                    if (lastYearMonths.length == 0) {
                        query = 'SELECT ReportsByMonth.month, count(ReportsByMonth.month) as count FROM ' +
                            '(SELECT YEAR(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month FROM Reports) as ReportsByMonth ' +
                            'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') GROUP BY ReportsByMonth.month ';
                    } else {
                        query = 'SELECT ReportsByMonth.month, count(ReportsByMonth.month) as count FROM ' +
                            '(SELECT YEAR(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(FROM_UNIXTIME(createdAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month FROM Reports) as ReportsByMonth ' +
                            'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') OR year = ' + lastYear + ' AND month IN ( + ' + lastYearMonths + ') GROUP BY ReportsByMonth.month ';
                    }

                    return sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT,
                        raw: true,
                        transaction: t
                    }).then(function (createdReport) {
                        result.createdReports = createdReport;

                        if (lastYearMonths.length == 0) {
                            query = 'SELECT ReportsByMonth.month, count(ReportsByMonth.month) as count FROM ' +
                                '(SELECT YEAR(CONVERT_TZ(FROM_UNIXTIME(solvedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(FROM_UNIXTIME(solvedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month FROM Reports WHERE solvedAt IS NOT NULL) as ReportsByMonth ' +
                                'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') GROUP BY ReportsByMonth.month ';
                        } else {
                            query = 'SELECT ReportsByMonth.month, count(ReportsByMonth.month) as count FROM ' +
                                '(SELECT YEAR(CONVERT_TZ(FROM_UNIXTIME(solvedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as year, MONTH(CONVERT_TZ(FROM_UNIXTIME(solvedAt/1000000),"+00:00", "' + timeZoneOffset + '")) as month FROM Reports WHERE solvedAt IS NOT NULL) as ReportsByMonth ' +
                                'WHERE year = ' + thisYear + ' AND month IN ( + ' + thisYearMonths + ') OR year = ' + lastYear + ' AND month IN ( + ' + lastYearMonths + ') GROUP BY ReportsByMonth.month ';
                        }

                        return sequelize.query(query, {
                            type: sequelize.QueryTypes.SELECT,
                            raw: true,
                            transaction: t
                        });
                    }).then(function (deletedReports) {
                        result.solvedReports = deletedReports;
                        return true;
                    });

                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {

                        result.createdReports.forEach(function (createdReport) {
                            reportsStatusByMonth.createdReports[createdReport.month + monthKey] = createdReport;
                        });

                        result.solvedReports.forEach(function (solvedReport) {
                            reportsStatusByMonth.solvedReports[solvedReport.month + monthKey] = solvedReport;
                        });

                        callback(200, reportsStatusByMonth);
                    }
                });

            }
        })
    }
};