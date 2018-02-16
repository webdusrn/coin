import '../../../../core/client/modules/common/base/loading-handler/assets/stylesheets/core.loading-handler.scss';

import coreBaseModule from '../../../../core/client/modules/common/base/core.base.module';
import sessionModule from '../../../../core/client/modules/common/session/core.session.module';
import usersModule from '../../../../core/client/modules/admin/users/core.users.module';
import noticesModule from '../../../../core/client/modules/admin/notices/core.notices.module';
import imagesModule from '../../../../core/client/modules/admin/images/core.images.module';
import termsModule from '../../../../core/client/modules/admin/terms/core.terms.module';
import companyInfoModule from '../../../../core/client/modules/admin/company-info/core.company-info.module';
import dashboardInfoModule from '../../../../core/client/modules/admin/dashboard-info/core.dashboard-info.module';
import notificationsModule from '../../../../core/client/modules/admin/notifications/core.notifications.module';
import reportsModule from '../../../../core/client/modules/admin/reports/core.reports.module';

import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-file-upload';
import 'angularjs-datepicker/dist/angular-datepicker.min.css';
import 'angularjs-datepicker';
import angularChart from 'angular-chart.js';

export default angular.module("app.admin-core", [
    coreBaseModule,
    sessionModule,
    usersModule,
    noticesModule,
    imagesModule,
    termsModule,
    reportsModule,
    companyInfoModule,
    dashboardInfoModule,
    notificationsModule,
    angularChart,
    uiBootstrap,
    'angularFileUpload',
    '720kb.datepicker'
]).name;