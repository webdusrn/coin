Upload.$inject = ['$resource', 'coreBaseUploadResources'];

export default function Upload ($resource, coreBaseUploadResources) {
    "ngInject";

    return $resource(coreBaseUploadResources.UPLOAD, {}, {});
}