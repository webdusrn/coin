VbankAmount.$inject = ['$resource', 'appResources'];

export default function VbankAmount($resource, appResources) {
    "ngInject";

    return $resource(appResources.VBANK_AMOUNT + '/:id', {
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