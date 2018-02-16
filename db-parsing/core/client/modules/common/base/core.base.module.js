import coreCommon from '../../../components/core.common.module';
import uiRouter from 'angular-ui-router';
import translate from 'angular-translate';
import cookies from 'angular-cookies';
import ngResource from 'angular-resource';
// import uiBootstrap from 'angular-ui-bootstrap';
// import 'angular-file-upload';

import metaManager from './meta/core.base.meta.manager';
import errorHandler from './error-handler/core.error.handler';
import coreBaseUploadResources from './upload-manager/core.base.upload.constant';
import Upload from './upload-manager/core.base.upload.model';
import Image from './upload-manager/core.base.image.model';
import uploadManager from './upload-manager/core.base.upload-manager';
import validateManager from './validator-manager/core.validator-manager';
import Validator from './validator-manager/core.validator';

import Focus from './alert-dialog/services/core.focus.service';

import loadingHandlerService from './loading-handler/services/core.loading-handler.service';
import LoadingHandlerCtrl from './loading-handler/controllers/core.loading-handler.controller';

import alertDialogService from './alert-dialog/services/core.alert-dialog.service';
import AlertDialogCtrl from './alert-dialog/controllers/core.alert-dialog.controller';

// import 'angularjs-datepicker/dist/angular-datepicker.min.css';
// import 'angularjs-datepicker';

export default angular.module("core.base", [
    coreCommon,
    uiRouter,
    translate,
    cookies,
    ngResource
    // uiBootstrap,
    // 'angularFileUpload',
    // '720kb.datepicker'
])
    .provider('metaManager', metaManager)
    .service('errorHandler', errorHandler)
    .constant('coreBaseUploadResources', coreBaseUploadResources)
    .factory('Upload', Upload)
    .factory('Image', Image)
    .factory('Focus', Focus)
    .service('uploadManager', uploadManager)
    .service('dialogHandler', alertDialogService)
    .service('loadingHandler', loadingHandlerService)
    .service('validateManager', validateManager)
    .factory('Validator', Validator)
    .controller('AlertDialogCtrl', AlertDialogCtrl)
    .controller('LoadingHandlerCtrl', LoadingHandlerCtrl)
    .name;