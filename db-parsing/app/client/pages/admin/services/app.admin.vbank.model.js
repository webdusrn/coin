Vbank.$inject = ['$resource', 'appResources'];

export default function Vbank($resource, appResources) {
    "ngInject";

    return $resource(appResources.VBANKS + '/:id', {
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