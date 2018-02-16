PremiumInfoAuthorization.$inject = ['$resource', 'appResources'];

export default function PremiumInfoAuthorization($resource, appResources) {
    "ngInject";

    return $resource(appResources.PREMIUM_INFO_AUTHORIZATION + '/:id', {
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