export default function imageUrl (metaManager) {
    "ngInject";

    return function (image, prefix, unauthorizedImageUrl) {
        if (image) {
            if (image.authorized || !unauthorizedImageUrl) {
                var imageName = image.name;
                if (prefix) {
                    imageName = prefix + '_' + imageName;
                }
                var rootUrl = metaManager.std.cdn.rootUrl;
                if (rootUrl && rootUrl[rootUrl.length - 1] == '/') {
                    rootUrl = rootUrl.substr(0, rootUrl.length - 1);
                }
                return rootUrl + '/' + metaManager.std.file.folderImages + '/' + image.folder + '/' + image.dateFolder + '/' + imageName;
            } else {
                return unauthorizedImageUrl;
            }
        } else {
            return null;
        }
    }
}