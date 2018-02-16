ContractInfoUnauthorization.$inject = ['$resource', 'appResources'];

export default function ContractInfoUnauthorization($resource, appResources) {
    "ngInject";

    return $resource(appResources.CONTRACT_INFO_UNAUTHORIZATION + '/:id', {
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