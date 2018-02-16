EngineerImage.$inject = ['$resource', 'appResources'];

export default function EngineerImage($resource, appResources) {
    "ngInject";

    return $resource(appResources.ENGINEER_IMAGE+ '/:id', {}, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    })
}