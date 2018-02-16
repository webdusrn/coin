PremiumPrice.$inject = ['$resource', 'appResources'];

export default function PremiumPrice($resource, appResources) {
    "ngInject";

    return $resource(appResources.PREMIUM_PRICE + '/:id', {
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