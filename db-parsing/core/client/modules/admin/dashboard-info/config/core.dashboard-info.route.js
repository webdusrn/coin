routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' +ADMIN.moduleDashboardInfo, {
            url: '',
            templateUrl: '/modules/admin/dashboard-info/views/core.' + ADMIN.moduleDashboardInfo + '.html'
        });
}