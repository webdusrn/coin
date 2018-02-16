import routes from './config/core.mass-notifications.route';
import MassNotificationsCtrl from './controllers/core.mass-notifications.controller';
import massNotificationsResources from './services/core.mass-notifications.constant';
import MassNotification from './services/core.mass-notification.model';
import massNotificationsManager from './services/core.mass-notifications.manager';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/mass-notifications/core.mass-notifications.scss'


export default angular.module("core.mass-notifications", [])
    .config(routes)
    .controller('MassNotificationsCtrl', MassNotificationsCtrl)
    .constant("massNotificationsResources", massNotificationsResources)
    .factory("MassNotification", MassNotification)
    .service("massNotificationsManager", massNotificationsManager)
    .name;