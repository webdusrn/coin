export default function blogPostsManager (BlogPost) {
    'ngInject';

    this.findBlogPosts = findBlogPosts;

    function findBlogPosts (query, callback) {
        BlogPost.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}