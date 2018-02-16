import reportsResources from './services/core.reports.constant';
import Report from './services/core.report.model';
import reportsManager from './services/core.reports.manager';
import ReportsCtrl from './controllers/core.reports.controller';

export default angular.module("core.reports", [])
    .constant("reportsResources", reportsResources)
    .factory("Report", Report)
    .service("reportsManager", reportsManager)
    .controller("ReportsCtrl", ReportsCtrl)
    .name;