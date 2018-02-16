import dashboardInfoResources from './services/core.dashboard-info.constant';
import DashboardInfo from './services/core.dashboard-info.model';
import dashboardInfoManager from './services/core.dashboard-info.manager';
import DashboardInfoCtrl from './controllers/core.dashboard-info.controller';
import routes from './config/core.dashboard-info.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/dashboard-info/core.dashboard-info.scss'


export default angular.module("core.dashboard-info", [])
    .config(routes)
    .constant("dashboardInfoResources", dashboardInfoResources)
    .factory("DashboardInfo", DashboardInfo)
    .service("dashboardInfoManager", dashboardInfoManager)
    .controller("DashboardInfoCtrl", DashboardInfoCtrl)
    .name;