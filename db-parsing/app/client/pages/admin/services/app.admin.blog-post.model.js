BlogPost.$inject = ['$resource', 'appResources'];

export default function BlogPost($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_POSTS + '/:id', {
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