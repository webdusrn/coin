MassNotificationCsv.$inject = ['$resource', 'massNotificationsResources'];

export default function MassNotificationCsv($resource, massNotificationsResources) {
    "ngInject";

    return $resource(massNotificationsResources.MASS_NOTIFICATION_CSV + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}