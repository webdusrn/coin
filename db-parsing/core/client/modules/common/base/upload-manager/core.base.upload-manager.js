export default function uploadManager (fileUploader, Upload, Image, coreBaseUploadResources) {
    "ngInject";

    this.uploadImages = uploadImages;
    this.deleteImages = deleteImages;
    this.findImageById = findImageById;

    function uploadImages (files, folder, callback) {
        fileUploader.upload('file', {
            folder: folder
        }, files, coreBaseUploadResources.IMAGES).then(function(data) {
            callback(201, data.data);
        }).catch(function(err) {
            callback(err.status, err.data)
        });
    }

    function deleteImages (imageIdArray, folder, callback) {
        var body = {
            folder: folder,
            imageIds: imageIdArray.join(","),
            _method: 'DELETE'
        };
        body = new Image(body);
        body.$save(function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findImageById (imageId, callback) {
        Image.get({
            id: imageId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}