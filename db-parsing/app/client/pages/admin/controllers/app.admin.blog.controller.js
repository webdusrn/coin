export default function BlogCtrl ($scope, $interval, $timeout, $uibModal, metaManager, dialogHandler, blogAccountsManager, blogSendingManager, autoBlogPostManager, blogInstanceManager) {
    'ngInject';

    var vm = $scope.vm;
    var isPolling = false;
    var instance = null;
    var prevBlogInstances = [];
    var indexHash = {};

    vm.activeNav = 'blog';

    $scope.enumSearchFields = metaManager.std.blogAccount.enumSearchFields;
    $scope.enumStates = ['noState', 'noDeadBlog'].concat(metaManager.std.blogAccount.enumStates);
    $scope.enumOrderBys = metaManager.std.blogAccount.enumOrderBys;
    $scope.enumSortTypes = metaManager.std.common.enumSortTypes;

    $scope.findBlogAccounts = findBlogAccounts;
    $scope.detailBlogAccount = detailBlogAccount;
    $scope.createBlogAccount = createBlogAccount;
    $scope.naverLogin = naverLogin;
    $scope.oauthLogin = oauthLogin;
    $scope.blogPost = blogPost;
    $scope.blogStats = blogStats;
    $scope.blogInstancePost = blogInstancePost;

    $scope.isBlogSending = null;
    $scope.currentSendingNum = 0;
    $scope.totalSendingNum = 0;

    $scope.blogInstances = [];
    $scope.canBlogPost = null;
    $scope.blogAccountPostingHash = {};

    $scope.more = false;
    $scope.now = new Date().getTime() * 1000;
    $scope.form = {
        searchField: $scope.enumSearchFields[0],
        orderBy: metaManager.std.blogAccount.defaultOrderBy,
        sort: metaManager.std.common.DESC,
        size: metaManager.std.common.loadingMaxLength,
        state: 'noState'
    };
    $scope.blogAccountHash = {};
    $scope.blogAccounts = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.state', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findBlogAccounts(true);
        }
    }, true);

    $scope.$watch('form.orderBy', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findBlogAccounts(true);
        }
    }, true);

    $scope.$watch('form.sort', function (newVal, oldVal) {
        if (newVal != oldVal) {
            findBlogAccounts(true);
        }
    }, true);

    // getBlogSending();
    getBlogInstanceSending();
    findBlogAccounts(true);

    function naverLogin (blogAccount, index) {
        $scope.blogAccountHash = {};
        $scope.blogAccountHash[index] = true;
        var $body = $('body');
        var $textarea = $('<textarea style="position: absolute; top: 0; left: -3000px;">').val(blogAccount.naverAccount);
        $body.append($textarea);
        $textarea.select();
        document.execCommand('copy');
        $textarea.remove();
        window.open("https://nid.naver.com/nidlogin.login", "naver_login", "width=800,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbar=yes,resizable=no,left=150,top=150");
    }

    function oauthLogin (blogAccount, index) {
        window.open(metaManager.std.blogAccount.oauthUrl + '/auto-login', "naver_oauth_login", "width=800,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbar=yes,resizable=no,left=150,top=150");
        if (vm.oauth) $interval.cancel(vm.oauth);
        (function (blogAccount) {
            vm.oauth = $interval(function () {
                blogAccountsManager.findBlogAccountById(blogAccount.id, function (status, data) {
                    if (status == 200) {
                        if ($scope.blogAccounts.rows[index].tokenUpdatedAt != data.tokenUpdatedAt) {
                            $interval.cancel(vm.oauth);
                            $scope.blogAccounts.rows[index] = data;
                        }
                    } else {
                        $interval.cancel(vm.oauth);
                        dialogHandler.alertError(status, data);
                    }
                });
            }, 500);
        })(blogAccount);
    }

    function blogPost (blogAccount, index) {
        if ($scope.isBlogSending || blogAccount.postNum <= blogAccount.todayPostCount) {
            return false;
        } else {
            $scope.isBlogSending = true;
            autoBlogPostManager.autoBlogPost({
                blogAccountId: blogAccount.id
            }, function (status, data) {
                if (status == 204) {
                    getBlogSending(blogAccount, index);
                } else {
                    $scope.isBlogSending = false;
                    dialogHandler.alertError(status, data);
                }
            });
        }
    }

    function findBlogAccounts (refresh) {
        var offset = null;
        if (refresh) {
            $scope.blogAccountHash = {};
            $scope.blogAccounts = {
                count: 0,
                rows: []
            };
        } else {
            offset = $scope.blogAccounts.rows.length;
        }
        var query = angular.copy($scope.form);
        if (offset) query.offset = offset;
        if (query.state == 'noState') delete query.state;
        blogAccountsManager.findBlogAccounts(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.blogAccounts = data;
                } else {
                    $scope.blogAccounts.rows = $scope.blogAccounts.rows.concat(data.rows);
                }
                indexHash = {};
                for (var i=0; i<$scope.blogAccounts.rows.length; i++) {
                    indexHash[$scope.blogAccounts.rows[i].id] = i;
                }
                $scope.more = $scope.blogAccounts.rows.length < $scope.blogAccounts.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function blogInstancePost (blogAccount, index) {
        if (!$scope.canBlogPost || blogAccount.postNum <= blogAccount.todayPostCount || $scope.blogAccountPostingHash[blogAccount.id]) {
            return false;
        } else {
            blogInstanceManager.blogInstancePost(blogAccount.id, function (status, data) {
                if (status == 204) {
                    getBlogInstanceSending();
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        }
    }

    function getBlogInstanceSending () {
        prevBlogInstances = $scope.blogInstances.slice();
        blogInstanceManager.getBlogInstanceSending(function (status, data) {
            if (status == 200) {
                $scope.blogInstances = data;
                check(data);
                if (isPolling) {
                    if (instance) $timeout.cancel(instance);
                    instance = $timeout(function () {
                        getBlogInstanceSending();
                    }, 1000);
                }
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function check (data) {
        $scope.blogAccountPostingHash = {};
        var blogAccountPostingHash = {};
        var postingNum = 0;
        for (var i=0; i<data.length; i++) {
            if (prevBlogInstances.length && prevBlogInstances[i].blogAccountId && !data[i].blogAccountId) {
                (function (index) {
                    blogAccountsManager.findBlogAccountById(prevBlogInstances[index].blogAccountId, function (status, data) {
                        if (status == 200) {
                            $scope.blogAccounts.rows[indexHash[prevBlogInstances[index].blogAccountId]] = data;
                        } else {
                            dialogHandler.alertError(status, data);
                        }
                    });
                })(i);
            }
            if (data[i].blogAccountId) {
                postingNum++;
                blogAccountPostingHash[data[i].blogAccountId] = true;
            }
        }
        $scope.blogAccountPostingHash = blogAccountPostingHash;
        isPolling = !!postingNum;
        $scope.canBlogPost = (data.length != postingNum);
    }

    function getBlogSending (blogAccount, index) {
        blogSendingManager.getBlogSending(function (status, data) {
            if (status == 200) {
                $scope.isBlogSending = data.isBlogSending;
                $scope.currentSendingNum = data.currentSendingNum;
                $scope.totalSendingNum = data.totalSendingNum;
                if ($scope.isBlogSending) {
                    if (vm.sending) $interval.cancel(vm.sending);
                    vm.sending = $interval(function () {
                        blogSendingManager.getBlogSending(function (status, data) {
                            if (status == 200) {
                                $scope.isBlogSending = data.isBlogSending;
                                $scope.currentSendingNum = data.currentSendingNum;
                                $scope.totalSendingNum = data.totalSendingNum;
                                if (!$scope.isBlogSending) {
                                    $interval.cancel(vm.sending);
                                    if (blogAccount) {
                                        blogAccountsManager.findBlogAccountById(blogAccount.id, function (status, data) {
                                            if (status == 200) {
                                                $scope.blogAccounts.rows[index] = data;
                                            } else {
                                                dialogHandler.alertError(status, data);
                                            }
                                        });
                                    }
                                }
                            } else {
                                dialogHandler.alertError(status, data);
                            }
                        })
                    }, 500);
                }
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function detailBlogAccount (blogAccount, index, size) {
        var detailInstance = $uibModal.open({
            animation: false,
            templateUrl: 'myDetailBlogAccount.html',
            controller: 'DetailBlogAccountCtrl',
            size: size,
            backdrop: true,
            resolve: {
                VM: function () {
                    return vm;
                },
                blogAccount: function () {
                    return blogAccount;
                }
            }
        });

        detailInstance.result.then(function (result) {
            vm.modalOpen = false;
            if (result.type == 'UPDATE') {
                $scope.blogAccounts.rows[index] = result.data;
            } else if (result.type == 'DELETE') {
                $scope.blogAccounts.rows.splice(index, 1);
            }
        }, function () {
            vm.modalOpen = false;
            console.log('cancel modal page');
        });
    }

    function createBlogAccount (size) {
        var createInstance = $uibModal.open({
            animation: false,
            templateUrl: 'myCreateBlogAccount.html',
            controller: 'CreateBlogAccountCtrl',
            size: size,
            backdrop: true,
            resolve: {
                VM: function () {
                    return vm;
                }
            }
        });

        createInstance.result.then(function (result) {
            vm.modalOpen = false;
            if ($scope.form.state == 'noState' || $scope.form.state == result.state) {
                $scope.blogAccounts.rows.unshift(result);
                $scope.blogAccounts.count++;
            }
        }, function () {
            vm.modalOpen = false;
            console.log('cancel modal page');
        });
    }

    function blogStats (size) {
        var instance = $uibModal.open({
            animation: false,
            templateUrl: 'myBlogStats.html',
            controller: 'BlogStatsCtrl',
            size: size,
            backdrop: true,
            resolve: {
                VM: function () {
                    return vm;
                }
            }
        });

        instance.result.then(function (result) {
            vm.modalOpen = false;
            console.log('close modal page');
        }, function () {
            vm.modalOpen = false;
            console.log('cancel modal page');
        });
    }
}