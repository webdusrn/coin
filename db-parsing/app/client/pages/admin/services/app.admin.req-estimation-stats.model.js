ReqEstimationStats.$inject = ['$resource', 'appResources'];

export default function ReqEstimationStats($resource, appResources) {
    "ngInject";

    return $resource(appResources.REQ_ESTIMATION_STATS, {}, {
        query: {
            isArray: false
        }
    })
}