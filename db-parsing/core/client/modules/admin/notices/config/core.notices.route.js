routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' +ADMIN.moduleNotices, {
            url: '/' + ADMIN.moduleNotices,
            templateUrl: '/modules/admin/notices/views/core.' + ADMIN.moduleNotices + '.html'
        });

}