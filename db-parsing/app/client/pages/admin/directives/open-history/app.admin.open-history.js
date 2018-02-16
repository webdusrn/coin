export default function openHistory (metaManager) {
    'ngInject';

    return {
        restrict: 'AE',
        templateUrl: metaManager.std.templatePath + 'admin/directives/open-history/app.admin.open-history.html'
    }
}