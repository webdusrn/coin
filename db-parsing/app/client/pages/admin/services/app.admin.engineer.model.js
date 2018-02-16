Engineer.$inject = ['$resource', 'appResources'];

export default function Engineer($resource, appResources) {
    "ngInject";

    return $resource(appResources.ENGINEER + '/:id', {
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