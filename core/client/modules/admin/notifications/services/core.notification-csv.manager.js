export default function massNotificationCsvManager(metaManager, MassNotificationCsv, fileUploader) {
    "ngInject";

    var COMMON = metaManager.std.common;

    this.sendNotificationCsv = sendNotificationCsv;

    function sendNotificationCsv(body, files, callback) {

        fileUploader.upload('file', body, files, '/api/admin/mass-notification-csv').then(function (data) {
            callback(201, data.data);
        }).catch(function (err) {
            callback(err.status, err.data)
        });

    }

}