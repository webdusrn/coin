PremiumInfo.$inject = ['$resource', 'appResources'];

export default function PremiumInfo($resource, appResources) {
    "ngInject";

    return $resource(appResources.PREMIUM_INFO + '/:id', {
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