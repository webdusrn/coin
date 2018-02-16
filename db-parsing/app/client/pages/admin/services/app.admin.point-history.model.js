PointHistory.$inject = ['$resource', 'appResources'];

export default function PointHistory($resource, appResources) {
    "ngInject";

    return $resource(appResources.POINT_HISTORIES, {}, {
        query: {
            isArray: false
        }
    })
}