export default function blogSendingManager (BlogSending) {
    'ngInject';

    this.getBlogSending = getBlogSending;

    function getBlogSending (callback) {
        BlogSending.get({}, {}, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}