export default function fileUploader($http) {
    "ngInject";

    this.upload = function (prefix, data, files, uploadUrl, callback) {
        var fd = new FormData();
        for (var i = 0; i < files.length; i++) {
            fd.append(prefix + i, files[i]);
        }
        for (var k in data) fd.append(k, data[k]);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            uploadEventHandlers: {
                progress: function (e) {
                    if (callback) {
                        callback({
                            loaded: e.loaded,
                            total: e.total
                        });
                    }
                }
            }
        });
    };
}