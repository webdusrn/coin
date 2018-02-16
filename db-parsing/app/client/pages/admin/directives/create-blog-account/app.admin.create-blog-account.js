export default function createBlogAccount (metaManager) {
    "ngInject";

    return {
        'restrict': 'AE',
        'templateUrl': metaManager.std.templatePath + 'admin/directives/create-blog-account/app.admin.create-blog-account.html'
    }
}