BlogSearch.$inject = ['$resource', 'appResources'];

export default function BlogSearch($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_SEARCH, {}, {})
}