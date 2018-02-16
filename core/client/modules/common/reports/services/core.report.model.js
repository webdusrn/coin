Report.$inject = ['$resource', 'reportsResources'];

export default function Report ($resource, reportsResources) {
    "ngInject";

    return $resource(reportsResources.REPORTS + '/:id', {
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