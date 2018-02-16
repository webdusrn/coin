User.$inject = ['$resource', 'appResources'];

export default function User($resource, appResources) {
    "ngInject";

    return $resource(appResources.USERS + '/:id', {
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