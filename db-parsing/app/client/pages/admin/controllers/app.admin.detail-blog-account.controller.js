export default function DetailBlogAccountCtrl ($scope, $timeout, $uibModalInstance, VM, blogAccount, blogPostsManager, blogAccountsManager, blogSearchManager, dialogHandler, metaManager) {
    'ngInject';

    var vm = $scope.vm = VM;
    var now = new Date();
    var startYear = 2017;
    vm.modalOpen = true;

    $scope.enumStates = metaManager.std.blogAccount.enumStates;

    $scope.cancel = cancel;
    $scope.updateBlogAccount = updateBlogAccount;
    $scope.findBlogPosts = findBlogPosts;
    $scope.naverSearch = naverSearch;
    $scope.blogOpen = blogOpen;
    $scope.copyUrl = copyUrl;
    $scope.active = active;
    $scope.removeBlogAccount = removeBlogAccount;

    $scope.activeTab = 1;
    $scope.ready = false;
    $scope.more = false;

    $scope.enumYears = [startYear.toString()];
    $scope.enumMonths = [];
    for (var i=0; i<now.getFullYear() - startYear; i++) {
        $scope.enumYears.unshift((startYear + i + 1).toString());
    }
    for (var i=1; i<13; i++) {
        $scope.enumMonths.push(i.toString());
    }

    $scope.searchForm = {
        blogAccountId: blogAccount.id
    };
    $scope.form = {};
    $scope.statsForm = {
        blogAccountId: blogAccount.id,
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString()
    };
    $scope.blogPosts = {
        count: 0,
        rows: []
    };

    if (blogAccount) {
        $scope.blogAccount = blogAccount;

        blogAccountsManager.findBlogAccountById(blogAccount.id, function (status, data) {
            if (status == 200) {
                $scope.form = data;
                findBlogPosts(true);
            } else {
                dialogHandler.show('', vm.translate('wrongRequest'), '', true);
            }
        });
    }

    function active (tab) {
        $scope.activeTab = tab;
    }

    function findBlogPosts (refresh) {
        var last = null;
        if (refresh) {
            $scope.blogPosts = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.blogPosts.rows[$scope.blogPosts.rows.length - 1].createdAt;
        }
        var query = angular.copy($scope.searchForm);
        if (last) query.last = last;
        $scope.ready = true;
        blogPostsManager.findBlogPosts(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.blogPosts = data;
                } else {
                    $scope.blogPosts.rows = $scope.blogPosts.rows.concat(data.rows);
                }
                $scope.more = $scope.blogPosts.rows.length < $scope.blogPosts.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function updateBlogAccount () {
        var body = angular.copy($scope.form);
        blogAccountsManager.updateBlogAccount(body, function (status, data) {
            if (status == 204) {
                blogAccountsManager.findBlogAccountById(body.id, function (status, data) {
                    if (status == 200) {
                        $uibModalInstance.close({
                            type: 'UPDATE',
                            data: data
                        });
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function removeBlogAccount () {
        dialogHandler.show(false, '삭제하시겠습니까?', '예', '아니오', function () {
            blogAccountsManager.removeBlogAccount($scope.form, function (status, data) {
                if (status == 204) {
                    $uibModalInstance.close({
                        type: 'DELETE'
                    });
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        }, false);
    }

    function naverSearch (blogPost) {
        blogSearchManager.searchBlog({
            naverAccount: blogAccount.naverAccount,
            searchItem: blogPost.blogTitle
        }, function (status, data) {
            if (status == 200) {
                if (data.existPage) {
                    blogPost.existPage = data.existPage + '페이지';
                } else {
                    blogPost.existPage = '없음';
                }
                blogPost.active = true;
                if (blogPost.activeInstance) $timeout.cancel(blogPost.activeInstance);
                blogPost.activeInstance = $timeout(function () {
                    blogPost.active = false;
                }, 500);
            } else if (status == 404) {
                blogPost.existPage = '없음';
                blogPost.active = true;
                if (blogPost.activeInstance) $timeout.cancel(blogPost.activeInstance);
                blogPost.activeInstance = $timeout(function () {
                    blogPost.active = false;
                }, 500);
            } else {
                dialogHandler.alert(status, data);
            }
        });
        // window.open("https://search.naver.com/search.naver?where=post&sm=tab_jum&query=" + encodeURI(blogPost.blogTitle), "naver_search", "width=800,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbar=yes,resizable=no,left=150,top=150");
    }

    function blogOpen (blogPost) {
        window.open(blogPost.blogUrl, "blog_open", "width=800,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbar=yes,resizable=no,left=150,top=150");
    }

    function copyUrl (blogPost) {
        var $body = $('body');
        var $textarea = $('<textarea style="position: absolute; top: 0; left: -3000px;">').val(blogPost.blogUrl);
        $body.append($textarea);
        $textarea.select();
        document.execCommand('copy');
        $textarea.remove();
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}