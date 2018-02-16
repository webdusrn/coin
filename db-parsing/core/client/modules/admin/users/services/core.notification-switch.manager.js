export default function notificationSwitchManager(NotificationSwitch) {
    "ngInject";

    this.findAllNotificationSwitch = findAllNotificationSwitch;
    this.findNotificationSwitchById = findNotificationSwitchById;
    this.updateNotificationSwitch = updateNotificationSwitch;
    this.deleteNotificationSwitch = deleteNotificationSwitch;

    function updateNotificationSwitch(notificationSwitch, callback) {

        NotificationSwitch.update({}, notificationSwitch, function (data) {
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNotificationSwitchById(id, callback) {
        NotificationSwitch.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status);
        });
    }

    function findAllNotificationSwitch(data, callback) {
        NotificationSwitch.query({
            userId: data.userId || '',
            sendType: data.sendType || '',
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteNotificationSwitch(notificationSwitch, callback) {
        notificationSwitch = new NotificationSwitch(notificationSwitch);
        notificationSwitch.$remove(function (data, status) {
            console.log(status, data);
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}