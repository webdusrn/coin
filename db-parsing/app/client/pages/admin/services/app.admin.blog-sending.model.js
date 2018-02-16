BlogSending.$inject = ['$resource', 'appResources'];

export default function BlogSending($resource, appResources) {
    "ngInject";

    return $resource(appResources.BLOG_SENDING, {}, {})
}