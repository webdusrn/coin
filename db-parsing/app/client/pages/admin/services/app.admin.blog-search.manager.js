export default function blogSearchManager (BlogSearch) {
    'ngInject';

    this.searchBlog = searchBlog;

    function searchBlog (query, callback) {
        BlogSearch.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}