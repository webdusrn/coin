var META = require('../../../bridge/metadata');
var sequelize = require('../config/sequelize');
var coreUtils = require('../utils');

module.exports = function (callback) {
    return callback();
    // coreUtils.initialization.initialize(function (status, data) {
    //     if (status == 204) {
    //
    //         coreUtils.initialization.initMobileVersion(function (status, data) {
    //
    //             if (status == 204) {
    //
    //                 coreUtils.initialization.initMassNotification(function (status, data) {
    //                     if (status == 204) {
    //
    //                         coreUtils.initialization.initNoSessionChatRoomUser(function (status, data) {
    //                             if (status == 204) {
    //                                 return callback();
    //                             } else {
    //                                 console.log(status, data);
    //                             }
    //                         });
    //
    //                     } else {
    //                         console.log(status, data);
    //                     }
    //                 });
    //
    //             } else {
    //                 console.log(status, data);
    //             }
    //         });
    //
    //     } else {
    //         console.log(status, data);
    //     }
    // });
};