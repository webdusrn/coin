ContractInfoAuthorization.$inject = ['$resource', 'appResources'];

export default function ContractInfoAuthorization($resource, appResources) {
    "ngInject";

    return $resource(appResources.CONTRACT_INFO_AUTHORIZATION + '/:id', {
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