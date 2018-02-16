routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' + ADMIN.moduleNotification, {
            url: '/' + ADMIN.moduleNotification,
            templateUrl: '/modules/admin/notifications/views/core.' + ADMIN.moduleNotification + '.html',
            params: {
                type: null,
                notificationName: null,
                title: null,
                body: null
            }
        });

}