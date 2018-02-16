export default function profileManager(Profile) {
    "ngInject";

    this.updateProfileByUserId = updateProfileByUserId;

    function updateProfileByUserId(userId, contents, callback) {
        var where = {};
        var body = {
            userId: userId,
            contents: contents
        };
        Profile.update(where, body, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}