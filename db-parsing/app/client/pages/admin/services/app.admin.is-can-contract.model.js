IsCanContract.$inject = ['$resource', 'appResources'];

export default function IsCanContract($resource, appResources) {
    "ngInject";

    return $resource(appResources.IS_CAN_CONTRACT + '/:id', {
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