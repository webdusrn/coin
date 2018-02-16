AutoBlogPost.$inject = ['$resource', 'appResources'];

export default function AutoBlogPost($resource, appResources) {
    "ngInject";

    return $resource(appResources.AUTO_BLOG_POST, {}, {})
}