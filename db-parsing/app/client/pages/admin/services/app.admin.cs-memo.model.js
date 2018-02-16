CsMemo.$inject = ['$resource', 'appResources'];

export default function CsMemo($resource, appResources) {
    "ngInject";

    return $resource(appResources.CS_MEMO + '/:id', {
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