routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;
    var ADMIN = window.meta.std.admin;
    $stateProvider
        .state(PREFIX.admin + '.' +ADMIN.moduleImages, {
            url: '/' + ADMIN.moduleImages,
            templateUrl: '/modules/admin/images/views/core.' + ADMIN.moduleImages + '.html'
        });
}