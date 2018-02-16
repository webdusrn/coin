GeoGraphyInfo.$inject = ['$resource', 'appResources'];

export default function GeoGraphyInfo($resource, appResources) {
    "ngInject";

    return $resource(appResources.GEO_GRAPHY_INFO + '/:id', {
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