export default function userManager (Engineer, User) {
    "ngInject";

    this.findUsers = findUsers;
    this.putEngineer = putEngineer;
    this.findUserById = findUserById;

    function findUsers (body, callback) {
        User.get(body, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function putEngineer (id, body, callback) {
        Engineer.update({id: id}, body, function (data) {
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findUserById (userId, callback) {
        User.get({
            id: userId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}