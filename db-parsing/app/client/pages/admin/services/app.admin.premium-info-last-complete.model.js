PremiumInfoLastComplete.$inject = ['$resource', 'appResources'];

export default function PremiumInfoLastComplete($resource, appResources) {
    "ngInject";

    return $resource(appResources.PREMIUM_INFO_LAST_COMPLETE + '/:id', {
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