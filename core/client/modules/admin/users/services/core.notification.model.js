Notification.$inject = ['$resource', 'usersResources'];

export default function Notification($resource, usersResources) {
    "ngInject";

    return $resource(usersResources.NOTIFICATION + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    });
}