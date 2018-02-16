ContractInfoUncomplete.$inject = ['$resource', 'appResources'];

export default function ContractInfoUncomplete($resource, appResources) {
    "ngInject";

    return $resource(appResources.CONTRACT_INFO_UNCOMPLETE + '/:id', {
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