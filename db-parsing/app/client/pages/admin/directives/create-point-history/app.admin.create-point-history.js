export default function createPointHistory (metaManager) {
    'ngInject';

    return {
        restrict: 'AE',
        templateUrl: metaManager.std.templatePath + 'admin/directives/create-point-history/app.admin.create-point-history.html'
    }
}