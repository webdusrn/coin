routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' +ADMIN.moduleReports, {
            url: '/' + ADMIN.moduleReports,
            templateUrl: '/modules/admin/reports/views/core.' + ADMIN.moduleReports + '.html'
        });
}