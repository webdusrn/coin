export default function detailBlogAccount (metaManager) {
    "ngInject";

    return {
        'restrict': 'AE',
        'templateUrl': metaManager.std.templatePath + 'admin/directives/detail-blog-account/app.admin.detail-blog-account.html'
    }
}