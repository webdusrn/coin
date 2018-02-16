export default function notificationManager(Notification) {
    "ngInject";

    this.findAllNotification = findAllNotification;
    this.findNotificationById = findNotificationById;
    this.updateNotificationById = updateNotificationById;
    this.deleteNotification = deleteNotification;

    function updateNotificationById(notification, callback) {
        var where = {id: notification.id};
        delete notification.id;
        Notification.update(where, notification, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNotificationById(id, callback) {
        Notification.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status);
        });
    }

    function findAllNotification(data, callback) {
        Notification.query({
            type: data.type || '',
            form: data.form || 'application',
            isStored: data.isStored || '',
            isOption: data.isOption || ''
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteNotification(notification, callback) {
        notification = new Notification(notification);
        notification.$remove(function (data, status) {
            console.log(status, data);
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}