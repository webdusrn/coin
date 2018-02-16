import usersResources from './services/core.users.constant';
import User from './services/core.users.model';
import usersManager from './services/core.users.manager';

export default angular.module("core.users", [])
    .constant("usersResources", usersResources)
    .factory("User", User)
    .service("usersManager", usersManager)
    .name;