import reportsResources from './services/core.reports.constant';
import Report from './services/core.reports.model';
import reportsManager from './services/core.reports.manager';
import ReportsCtrl from './controllers/core.reports.controller';
import ReportDetailCtrl from './controllers/core.report-detail.controller';
import reportDetail from './directives/report-detail/core.report-detail';
import routes from './config/core.reports.route';
#{importCoreTheme}
#{importAppTheme}

export default angular.module("core.reports", [])
    .config(routes)
    .constant("reportsResources", reportsResources)
    .factory("Report", Report)
    .service("reportsManager", reportsManager)
    .controller("ReportsCtrl", ReportsCtrl)
    .controller("ReportDetailCtrl", ReportDetailCtrl)
    .directive("reportDetail", reportDetail)
    .name;