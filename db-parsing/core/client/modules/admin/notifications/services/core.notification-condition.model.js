MassNotificationCondition.$inject = ['$resource', 'massNotificationsResources'];

export default function MassNotificationCondition($resource, massNotificationsResources) {
    "ngInject";

    return $resource(massNotificationsResources.MASS_NOTIFICATION_CONDITION + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}