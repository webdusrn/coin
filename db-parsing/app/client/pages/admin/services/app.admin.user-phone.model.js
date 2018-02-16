UserPhone.$inject = ['$resource', 'appResources'];

export default function UserPhone($resource, appResources) {
    "ngInject";

    return $resource(appResources.USER_PHONE + '/:id', {
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