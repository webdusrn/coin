import dashboardInfoResources from './services/core.dashboard-info.constant';
import DashboardInfo from './services/core.dashboard-info.model';
import dashboardInfoManager from './services/core.dashboard-info.manager';
import DashboardInfoCtrl from './controllers/core.dashboard-info.controller';
import routes from './config/core.dashboard-info.route';
#{importCoreTheme}
#{importAppTheme}

export default angular.module("core.dashboard-info", [])
    .config(routes)
    .constant("dashboardInfoResources", dashboardInfoResources)
    .factory("DashboardInfo", DashboardInfo)
    .service("dashboardInfoManager", dashboardInfoManager)
    .controller("DashboardInfoCtrl", DashboardInfoCtrl)
    .name;