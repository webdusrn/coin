PremiumInfoUnauthorization.$inject = ['$resource', 'appResources'];

export default function PremiumInfoUnauthorization($resource, appResources) {
    "ngInject";

    return $resource(appResources.PREMIUM_INFO_UNAUTHORIZATION + '/:id', {
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