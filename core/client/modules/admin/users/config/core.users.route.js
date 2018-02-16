routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' +ADMIN.moduleUsers, {
            url: '/' + ADMIN.moduleUsers,
            templateUrl: 'modules/admin/users/views/core.' + ADMIN.moduleUsers + '.html'
        });
}