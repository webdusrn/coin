DashboardInfo.$inject = ['$resource', 'dashboardInfoResources'];

export default function DashboardInfo($resource, dashboardInfoResources) {
    "ngInject";

    return $resource(dashboardInfoResources.DASHBOARD_INFO, {}, {});
}