export default function memo(metaManager) {
    "ngInject";

    return {
        'restrict': 'AE',
        'templateUrl': metaManager.std.templatePath + 'admin/directives/memo/app.admin.memo.html'

    }
}