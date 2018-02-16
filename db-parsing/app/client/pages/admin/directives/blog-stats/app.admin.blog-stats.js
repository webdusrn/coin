export default function blogStats (metaManager) {
    'ngInject';

    return {
        restrict: 'AE',
        templateUrl: metaManager.std.templatePath + 'admin/directives/blog-stats/app.admin.blog-stats.html'
    }
}