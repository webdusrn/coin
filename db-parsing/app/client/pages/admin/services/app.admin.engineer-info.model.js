EngineerInfo.$inject = ['$resource', 'appResources'];

export default function EngineerInfo($resource, appResources) {
    "ngInject";

    return $resource(appResources.ENGINEER_INFO + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}