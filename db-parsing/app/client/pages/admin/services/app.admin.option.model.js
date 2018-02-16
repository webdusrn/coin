Option.$inject = ['$resource', 'appResources'];

export default function Option($resource, appResources) {
    "ngInject";

    return $resource(appResources.OPTIONS, {}, {
        query: {
            isArray: false
        }
    })
}