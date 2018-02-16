export default function sessionRemoteManager(SessionRemote) {
    "ngInject";

    this.deleteSessionRemote = deleteSessionRemote;

    function deleteSessionRemote(loginHistory, callback) {
        var body = {
            id: loginHistory.id
        };
        SessionRemote.delete(body, function (data) {
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}