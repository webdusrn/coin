import companyInfoResources from './services/core.company-info.constant';
import CompanyInfo from './services/core.company-info.model';
import companyInfoManager from './services/core.company-info.manager';
import CompanyInfoCtrl from './controllers/core.company-info.controller';
import routes from './config/core.company-info.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/company-info/core.company-info.scss'


export default angular.module("core.company-info", [])
    .config(routes)
    .constant("companyInfoResources", companyInfoResources)
    .factory("CompanyInfo", CompanyInfo)
    .service("companyInfoManager", companyInfoManager)
    .controller("CompanyInfoCtrl", CompanyInfoCtrl)
    .name;