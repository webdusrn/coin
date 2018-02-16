AdminUser.$inject = ['$resource', 'usersResources'];

export default function AdminUser($resource, usersResources) {
    "ngInject";

    return $resource(usersResources.ADMIN_USERS + '/:id', {
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