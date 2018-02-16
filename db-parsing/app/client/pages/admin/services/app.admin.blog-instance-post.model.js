BlogInstancePost.$inject = ['$resource', 'appResources'];

export default function BlogInstancePost($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_INSTANCE_POST + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    })
}