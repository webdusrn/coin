export default function ckEditor(metaManager) {
    "ngInject";

    var HOST = metaManager.std.host;

    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0], {
                filebrowserImageUploadUrl: HOST.url + '/api/etc/upload-ck'
            });

            if (!ngModel) return;

            ck.on('pasteState', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function (value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
}