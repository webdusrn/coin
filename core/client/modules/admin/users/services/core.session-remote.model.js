SessionRemote.$inject = ['$resource', 'usersResources'];

export default function SessionRemote($resource, usersResources) {
    "ngInject";

    return $resource(usersResources.SESSION_REMOTE + '/:id', {
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