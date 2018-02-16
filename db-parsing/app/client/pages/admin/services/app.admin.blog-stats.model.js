BlogStats.$inject = ['$resource', 'appResources'];

export default function BlogStats($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_STATS, {}, {
        query: {
            isArray: false
        }
    })
}