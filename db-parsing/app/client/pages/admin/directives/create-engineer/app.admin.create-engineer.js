export default function createEngineer(metaManager) {
    "ngInject";

    return {
        'restrict': 'AE',
        'templateUrl': metaManager.std.templatePath + 'admin/directives/create-engineer/app.admin.create-engineer.html'

    }
}