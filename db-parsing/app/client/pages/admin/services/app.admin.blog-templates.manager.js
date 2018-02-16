export default function blogTemplatesManager (BlogTemplate) {
    'ngInject';

    this.getBlogTemplates = getBlogTemplates;

    function getBlogTemplates (callback) {
        BlogTemplate.query({}, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}