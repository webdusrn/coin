
import svgImage from './svg-image/core.common.svg-image';
import StaticLoader from './static-loader/core.common.static-loader';
import errSrc from './err-src/core.common.err-src';
import inputPass from './input-pass/core.common.input-pass';
import toMicrotime from './to-microtime/core.common.to-microtime';
import microTimeTo12hoursTime from './microtime-to-12hours-time/core.common.microtime-to-12hours-time';
import microTimeToDate from './microtime-to-date/core.common.microtime-to-date';
import microTimeToDateTime from './microtime-to-date-time/core.common.microtime-to-date-time';
import trustAsHtml from './trust-as-html/core.common.trust-as-html';
import roundUp from './round-up/core.common.round-up';
import ckEditor from './ck-editor/core.common.ck-editor';
import notificationBody from './notification-body/core.common.notification-body';
import imageUrl from './image-url/core.common.image-url';
import multiByteHandler from './multi-byte/core.common.multi-byte.handler';
import convertToNumber from './convert-to-number/core.common.convert-to-number';
import parseDate from './parse-date/core.common.parse-date';

import fileModel from './file-model/core.common.file-model';
import fileUploader from './file-uploader/core.common.file-uploader';

export default angular.module('core.common', [])
    .directive(svgImage)
    .directive(errSrc)
    .directive('inputPass', inputPass)
    .filter('toMicrotime', toMicrotime)
    .filter('microTimeTo12hoursTime', microTimeTo12hoursTime)
    .filter('microTimeToDateTime', microTimeToDateTime)
    .filter('microTimeToDate', microTimeToDate)
    .filter('trustAsHtml', trustAsHtml)
    .filter('roundUp', roundUp)
    .filter('notificationBody', notificationBody)
    .filter('imageUrl', imageUrl)
    .filter('parseDate', parseDate)
    .provider('staticLoader', StaticLoader)
    .directive('ckEditor', ckEditor)
    .directive('fileModel', fileModel)
    .directive('convertToNumber', convertToNumber)
    .service('fileUploader', fileUploader)
    .service('multiByteHandler', multiByteHandler)
    .name;
