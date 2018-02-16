NotificationSwitch.$inject = ['$resource', 'usersResources'];

export default function NotificationSwitch($resource, usersResources) {
    "ngInject";

    return $resource(usersResources.NOTIFICATION_SWITCH + '/:id', {
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