Pass.$inject = ['$resource', 'sessionResources'];

export default function Pass($resource, sessionResources) {
    "ngInject";

    return $resource(sessionResources.PASS, {}, {
        update: {
            method: 'PUT'
        }
    });
}