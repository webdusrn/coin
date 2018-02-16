ContractInfo.$inject = ['$resource', 'appResources'];

export default function ContractInfo($resource, appResources) {
    "ngInject";

    return $resource(appResources.CONTRACT_INFO + '/:id', {
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