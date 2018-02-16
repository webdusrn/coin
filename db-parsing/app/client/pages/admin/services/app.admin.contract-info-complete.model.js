ContractInfoComplete.$inject = ['$resource', 'appResources'];

export default function ContractInfoComplete($resource, appResources) {
    "ngInject";

    return $resource(appResources.CONTRACT_INFO_COMPLETE + '/:id', {
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