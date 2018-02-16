BlogInstanceSending.$inject = ['$resource', 'appResources'];

export default function BlogInstanceSending($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_INSTANCE_SENDING + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: true
        }
    })
}