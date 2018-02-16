NotificationPublicSwitch.$inject = ['$resource', 'usersResources'];

export default function NotificationPublicSwitch($resource, usersResources) {
    "ngInject";

    return $resource(usersResources.NOTIFICATION_PUBLIC_SWITCH + '/:id', {
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