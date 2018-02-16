export default function blogAccountsManager (BlogAccount) {
    'ngInject';

    this.findBlogAccounts = findBlogAccounts;
    this.findBlogAccountById = findBlogAccountById;
    this.createBlogAccount = createBlogAccount;
    this.updateBlogAccount = updateBlogAccount;
    this.removeBlogAccount = removeBlogAccount;

    function findBlogAccounts (query, callback) {
        BlogAccount.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findBlogAccountById (blogAccountId, callback) {
        BlogAccount.get({
            id: blogAccountId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createBlogAccount (body, callback) {
        var blogAccount = new BlogAccount(body);
        blogAccount.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function updateBlogAccount (data, callback) {
        var where = {id: data.id};
        var body = {};
        if (data.state !== undefined) body.state = data.state;
        if (data.blogTemplateId !== undefined) body.blogTemplateId = data.blogTemplateId;
        if (data.blogTitleItemNo !== undefined) body.blogTitleItemNo = data.blogTitleItemNo;
        if (data.categoryNo !== undefined) body.categoryNo = data.categoryNo;
        if (data.postNum !== undefined) body.postNum = data.postNum;
        BlogAccount.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function removeBlogAccount (blogAccount, callback) {
        blogAccount = new BlogAccount(blogAccount);
        blogAccount.$remove(function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}