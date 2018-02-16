// (function () {
//     'use strict';
//
//     angular.module('core.admin').config(adminConfig);
//
//     /* @ngInject */
//     function adminConfig($stateProvider) {
//         var PREFIX = window.meta.std.prefix;
//         $stateProvider
//             .state(PREFIX.admin + '-user-manage', {
//                 url: '/' + PREFIX.admin + '/user-manage',
//                 views: {
//                     'contents': {
//                         templateUrl: 'pages/admin/views/contents/user-manage.html'
//                     }
//                 }
//             });
//     }
// })();

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    "ngInject";

    $stateProvider
        .state('login', {
            url: '/admin/login',
            templateUrl: 'modules/session/views/core.session.login.html'
        })
        .state('report', {
            url: '/admin/report',
            templateUrl: 'modules/admin/views/core.admin.report.html'
        });
}