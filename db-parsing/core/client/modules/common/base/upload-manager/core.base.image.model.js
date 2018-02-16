Image.$inject = ['$resource', 'coreBaseUploadResources'];

export default function Image ($resource, coreBaseUploadResource) {
    "ngInject";

    return $resource(coreBaseUploadResource.IMAGES + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: true
        }
    });
}