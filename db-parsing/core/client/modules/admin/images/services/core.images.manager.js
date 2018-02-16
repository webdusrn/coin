export default function imagesManager(Image, metaManager) {
    "ngInject";

    var COMMON = metaManager.std.common;

    this.findImageById = findImageById;
    this.updateImageById = updateImageById;
    this.findImages = findImages;
    this.deleteImage = deleteImage;
    this.createImage = createImage;

    function updateImageById(id, image, callback) {
        var where = {id: id};
        Image.update(where, image, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findImageById(imageId, callback) {
        Image.get({
            id: imageId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findImages(data, callback) {
        var query = {};
        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.searchField !== undefined && data.searchField != COMMON.all) query.searchField = data.searchField;
        if (data.searchItemUser !== undefined) query.searchItemUser = data.searchItemUser;
        if (data.searchFieldUser !== undefined && data.searchFieldUser != COMMON.all) query.searchFieldUser = data.searchFieldUser;
        if (data.authorId !== undefined) query.authorId = data.authorId;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.orderBy !== undefined) query.orderBy = data.orderBy;
        if (data.sort !== undefined) query.sort = data.sort;
        if (data.folder !== undefined && data.folder != COMMON.all) query.folder = data.folder;
        if (data.authorized !== undefined) query.authorized = data.authorized;
        Image.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteImage(image, callback) {
        var body = {
            folder: image.folder,
            imageIds: image.id.toString(),
            _method: 'DELETE'
        };
        image = new Image(body);
        image.$save(function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createImage(body, callback) {
        var image = new Image(body);
        image.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}