export default function notificationBoxManager(NotificationBox) {
    "ngInject";

    this.findAllNotificationBox = findAllNotificationBox;
    this.findNotificationBoxById = findNotificationBoxById;
    this.updateNotificationBoxById = updateNotificationBoxById;
    this.deleteNotificationBox = deleteNotificationBox;

    function updateNotificationBoxById(notificationBox, callback) {
        var where = {id: notificationBox.id};
        delete notificationBox.id;
        NotificationBox.update(where, notificationBox, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNotificationBoxById(id, callback) {
        NotificationBox.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status);
        });
    }

    function findAllNotificationBox(data, callback) {
        NotificationBox.query({
            userId: data.userId || '',
            last: data.last || '',
            size: data.size || '',
            offset: data.offset || ''
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteNotificationBox(notificationBox, callback) {
        notificationBox = new NotificationBox(notificationBox);
        notificationBox.$remove(function (data, status) {
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}