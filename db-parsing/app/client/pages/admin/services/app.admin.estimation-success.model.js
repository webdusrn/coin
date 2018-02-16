EstimationSuccess.$inject = ['$resource', 'appResources'];

export default function EstimationSuccess($resource, appResources) {
    "ngInject";

    return $resource(appResources.ESTIMATION_SUCCESS + '/:id', {
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