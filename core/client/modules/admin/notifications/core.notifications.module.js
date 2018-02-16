
import massNotificationsResources from './services/core.notifications.constant';
import MassNotification from './services/core.notification.model';
import MassNotificationCondition from './services/core.notification-condition.model';
import MassNotificationCsv from './services/core.notification-csv.model';

import massNotificationsManager from './services/core.notifications.manager';
import massNotificationConditionManager from './services/core.notification-condition.manager';
import massNotificationCsvManager from './services/core.notification-csv.manager';

import MassNotificationsCtrl from './controllers/core.notifications.controller';
import MassNotificationsCreateCtrl from './controllers/core.notifications-create.controller';
import MassNotificationsDetailCtrl from './controllers/core.notifications-detail.controller';

import massNotificationsCreate from './directives/notifications-create/core.notifications-create';
import massNotificationsDetail from './directives/notifications-detail/core.notifications-detail';

import routes from './config/core.notifications.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/notifications/core.notifications.scss'


export default angular.module("core.notifications", [])
    .config(routes)
    .constant('massNotificationsResources', massNotificationsResources)
    .factory('MassNotification', MassNotification)
    .factory('MassNotificationCondition', MassNotificationCondition)
    .factory('MassNotificationCsv', MassNotificationCsv)
    .service('massNotificationsManager', massNotificationsManager)
    .service('massNotificationConditionManager', massNotificationConditionManager)
    .service('massNotificationCsvManager', massNotificationCsvManager)
    .controller('MassNotificationsCtrl', MassNotificationsCtrl)
    .controller('MassNotificationsCreateCtrl', MassNotificationsCreateCtrl)
    .controller('MassNotificationsDetailCtrl', MassNotificationsDetailCtrl)
    .directive("massNotificationsCreate", massNotificationsCreate)
    .directive("massNotificationsDetail", massNotificationsDetail)
    .name;