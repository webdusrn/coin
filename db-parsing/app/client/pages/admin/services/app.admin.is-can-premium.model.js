IsCanPremium.$inject = ['$resource', 'appResources'];

export default function IsCanPremium($resource, appResources) {
    "ngInject";

    return $resource(appResources.IS_CAN_PREMIUM + '/:id', {
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