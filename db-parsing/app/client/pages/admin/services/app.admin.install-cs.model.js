InstallCs.$inject = ['$resource', 'appResources'];

export default function InstallCs($resource, appResources) {
    "ngInject";

    return $resource(appResources.INSTALL_CS + '/:id', {
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