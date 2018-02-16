Notice.$inject = ['$resource', 'noticesResources'];

export default function Notice($resource, noticesResources) {
    "ngInject";

    return $resource(noticesResources.NOTICES + '/:id', {
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