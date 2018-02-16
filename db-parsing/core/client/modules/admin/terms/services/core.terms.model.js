Terms.$inject = ['$resource', 'termsResources'];

export default function Terms($resource, termsResources) {
    "ngInject";

    return $resource(termsResources.TERMS + '/:id', {
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