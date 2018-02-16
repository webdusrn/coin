import coreBaseModule from '../base/core.base.module';
import users from '../users/core.users.module';

import routing from './config/core.session.route';
import SessionCtrl from './controllers/core.session.controller';
import sessionResources from './services/core.session.constant';
import Session from './services/core.session.model';
import SocialSession from './services/core.session.social-session.model';
import Pass from './services/core.session.pass.model';
import SenderEmail from './services/core.session.sender-email.model';
import sessionManager from './services/core.session.manager';
import oauthManager from './services/core.session.oauth.manager';
import sessionValidationManager from './services/core.session.validate.manager';

export default angular.module("core.session", [
    coreBaseModule,
    users
])
    .config(routing)
    .controller("SessionCtrl", SessionCtrl)
    .constant("sessionResources", sessionResources)
    .factory("Session", Session)
    .factory("SocialSession", SocialSession)
    .factory("Pass", Pass)
    .factory("SenderEmail", SenderEmail)
    .service("sessionManager", sessionManager)
    .service("oauthManager", oauthManager)
    .service("sessionValidationManager", sessionValidationManager)
    .name;