export default function autoBlogPostManager (AutoBlogPost) {
    'ngInject';

    this.autoBlogPost = autoBlogPost;

    function autoBlogPost (data, callback) {
        var body = {};
        if (data.blogAccountId !== undefined) body.blogAccountId = data.blogAccountId;
        var autoBlogPost = new AutoBlogPost(body);
        autoBlogPost.$save(function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}