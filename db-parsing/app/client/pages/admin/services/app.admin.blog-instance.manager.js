export default function blogInstanceManager (BlogInstancePost, BlogInstanceSending) {
    'ngInject';

    this.blogInstancePost = blogInstancePost;
    this.getBlogInstanceSending = getBlogInstanceSending;

    function blogInstancePost (blogAccountId, callback) {
        var body = {blogAccountId: blogAccountId};
        var blogInstancePost = new BlogInstancePost(body);
        blogInstancePost.$save(function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function getBlogInstanceSending (callback) {
        BlogInstanceSending.query({}, {}, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}