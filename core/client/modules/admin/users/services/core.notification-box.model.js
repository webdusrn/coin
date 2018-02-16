NotificationBox.$inject = ['$resource', 'usersResources'];

export default function NotificationBox($resource, usersResources) {
    "ngInject";

    return $resource(usersResources.NOTIFICATION_BOX + '/:id', {
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