ReqEstimationUser.$inject = ['$resource', 'appResources'];

export default function ReqEstimationUser($resource, appResources) {
    "ngInject";

    return $resource(appResources.REQ_ESTIMATION_USER + '/:id', {
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