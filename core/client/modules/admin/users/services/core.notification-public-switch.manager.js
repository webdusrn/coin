export default function notificationSwitchManager(NotificationPublicSwitch) {
    "ngInject";

    this.findAllNotificationPublicSwitch = findAllNotificationPublicSwitch;
    this.findNotificationPublicSwitchById = findNotificationPublicSwitchById;
    this.updateNotificationPublicSwitch = updateNotificationPublicSwitch;
    this.deleteNotificationPublicSwitch = deleteNotificationPublicSwitch;

    function updateNotificationPublicSwitch(notificationPublicSwitch, callback) {

        NotificationPublicSwitch.update({}, notificationPublicSwitch, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNotificationPublicSwitchById(id, callback) {
        NotificationPublicSwitch.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status);
        });
    }

    function findAllNotificationPublicSwitch(data, callback) {
        NotificationPublicSwitch.query({
            userId: data.userId || '',
            sendType: data.sendType || '',
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteNotificationPublicSwitch(notificationPublicSwitch, callback) {
        notificationPublicSwitch = new NotificationPublicSwitch(notificationSwitch);
        notificationPublicSwitch.$remove(function (data, status) {
            console.log(status, data);
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}