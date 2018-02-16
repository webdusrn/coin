export default function premiumPrice (metaManager) {
    'ngInject';

    return {
        restrict: 'AE',
        templateUrl: metaManager.std.templatePath + 'admin/directives/premium-price/app.admin.premium-price.html'
    }
}