SocialSession.$inject = ['$resource', 'sessionResources'];

export default function SocialSession($resource, sessionResources) {
    "ngInject";

    return $resource(sessionResources.SOCIAL_SESSION, {}, {});
}