BlogAccount.$inject = ['$resource', 'appResources'];

export default function BlogAccount($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_ACCOUNTS + '/:id', {
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