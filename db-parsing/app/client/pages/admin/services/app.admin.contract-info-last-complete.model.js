ContractInfoLastComplete.$inject = ['$resource', 'appResources'];

export default function ContractInfoLastComplete($resource, appResources) {
    "ngInject";

    return $resource(appResources.CONTRACT_INFO_LAST_COMPLETE + '/:id', {
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