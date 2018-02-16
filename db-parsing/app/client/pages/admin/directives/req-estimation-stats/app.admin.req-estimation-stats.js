export default function reqEstimationStats (metaManager) {
    'ngInject';

    return {
        restrict: 'AE',
        templateUrl: metaManager.std.templatePath + 'admin/directives/req-estimation-stats/app.admin.req-estimation-stats.html'
    }
}