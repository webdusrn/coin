AsHistory.$inject = ['$resource', 'appResources'];

export default function AsHistory($resource, appResources) {
    "ngInject";

    return $resource(appResources.AS_HISTORY + '/:id', {
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