import imagesResources from './services/core.images.constant';
import Image from './services/core.images.model';
import imagesManager from './services/core.images.manager';
import ImagesCtrl from './controllers/core.images.controller';
import routes from './config/core.images.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/images/core.images.scss'


export default angular.module("core.images", [])
    .config(routes)
    .constant("imagesResources", imagesResources)
    .factory("Image", Image)
    .service("imagesManager", imagesManager)
    .controller("ImagesCtrl", ImagesCtrl)
    .name;