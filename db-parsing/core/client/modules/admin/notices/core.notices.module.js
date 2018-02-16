import noticesResources from './services/core.notices.constant';
import Notice from './services/core.notices.model';
import noticesManager from './services/core.notices.manager';
import NoticesCtrl from './controllers/core.notices.controller';
import NoticeCreateCtrl from './controllers/core.notice-create.controller';
import NoticeDetailCtrl from './controllers/core.notice-detail.controller';
import noticeCreate from './directives/notice-create/core.notice-create';
import noticeDetail from './directives/notice-detail/core.notice-detail';
import routes from './config/core.notices.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/notices/core.notices.scss'


export default angular.module("core.notices", [])
    .config(routes)
    .constant("noticesResources", noticesResources)
    .factory("Notice", Notice)
    .service("noticesManager", noticesManager)
    .controller("NoticesCtrl", NoticesCtrl)
    .controller("NoticeCreateCtrl", NoticeCreateCtrl)
    .controller("NoticeDetailCtrl", NoticeDetailCtrl)
    .directive("noticeCreate", noticeCreate)
    .directive("noticeDetail", noticeDetail)
    .name;