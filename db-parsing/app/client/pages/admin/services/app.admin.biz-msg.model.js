BizMsg.$inject = ['$resource', 'appResources'];

export default function BizMsg($resource, appResources) {
    "ngInject";

    return $resource(appResources.BIZ_MSG + '/:id', {
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