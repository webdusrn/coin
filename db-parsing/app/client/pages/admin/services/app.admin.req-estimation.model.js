ReqEstimation.$inject = ['$resource', 'appResources'];

export default function ReqEstimation($resource, appResources) {
    "ngInject";

    return $resource(appResources.REQ_ESTIMATION + '/:id', {
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