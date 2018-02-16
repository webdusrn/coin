export default function usersManager(User, AdminUser, metaManager) {
    "ngInject";

    var USER = metaManager.std.user;

    this.findAllUsers = findAllUsers;
    this.findUserById = findUserById;
    this.updateUserById = updateUserById;
    this.signup = signup;
    this.deleteUser = deleteUser;

    function updateUserById(id, data, callback) {
        var where = {id: id};
        User.update(where, data, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findUserById(id, callback) {
        User.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status);
        });
    }

    function findAllUsers(data, callback) {

        var query = {};

        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.searchField !== undefined) query.searchField = data.searchField;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.order !== undefined) query.order = data.order;
        if (data.sorted !== undefined) query.sorted = data.sorted;
        if (data.role !== undefined && data.role != USER.roleAll) query.role = data.role;
        if (data.gender !== undefined && data.gender != USER.genderAll) query.gender = data.gender;

        AdminUser.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function signup(body, callback) {
        var user = new User(body);
        user.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteUser(user, callback) {
        user = new User(user);
        user.$remove(function (data, status) {
            console.log(status, data);
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}