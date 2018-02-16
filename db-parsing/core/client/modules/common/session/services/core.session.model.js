Session.$inject = ['$resource', 'sessionResources'];

export default function Session($resource, sessionResources) {
    "ngInject";

    return $resource(sessionResources.SESSION, {}, {
        update: {
            method: 'PUT'
        }
    });
}