routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' + ADMIN.moduleCompanyInfo, {
            url: '/' + ADMIN.moduleCompanyInfo,
            templateUrl: '/modules/admin/company-info/views/core.' + ADMIN.moduleCompanyInfo + '.html'
        });
}