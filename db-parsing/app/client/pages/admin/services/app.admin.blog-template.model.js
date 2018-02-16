BlogTemplate.$inject = ['$resource', 'appResources'];

export default function BlogTemplate($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_TEMPLATES, {}, {
        query: {
            isArray: false
        }
    })
}