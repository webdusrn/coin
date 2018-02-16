routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider, $urlRouterProvider) {
    var STD = window.meta.std;
    var PREFIX = STD.prefix;
    var templatePath = STD.templatePath;

    $urlRouterProvider.otherwise('/admin');

    $stateProvider
        .state('user-info', {
            url: '/user-info',
            views: {
                'contents': {
                    templateUrl: function () {
                        return '/pages/admin/views/contents/users/users.html';

                    }
                }
            }
        })
        .state('engineer', {
            url: '/engineer',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/engineer/engineer.html';
                    }
                }
            }
        })
        .state('req-estimation', {
            url: '/req-estimation',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/req-estimation/index.html';
                    }
                }
            }
        })

        .state(PREFIX.admin, {
            abstract: true,
            url: '/' + PREFIX.admin,
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/layouts/main-contents.html';
                    }
                }
            }
        })
        .state('not-found', {
            url: '/not-found',
            views: {
                'contents': {
                    templateUrl: templatePath + 'admin/views/contents/404.html'
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/layouts/login.html';
                    }
                }
            }
        })
        .state('point-history', {
            url: '/point-history',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/point-history.html';
                    }
                }
            }
        })
        .state('install-cs', {
            url: '/install-cs',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/install-cs.html';
                    }
                }
            }
        })
        .state('vbank', {
            url: '/vbank',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/vbank.html';
                    }
                }
            }
        })
        .state('option', {
            url: '/option',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/option.html';
                    }
                }
            }
        })
        .state('blog', {
            url: '/blog',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/blog.html';
                    }
                }
            }
        })
        .state('engineer-phone-num', {
            url: '/engineer-phone-num',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/engineer-phone-num.html';
                    }
                }
            }
        })
        .state('biz-msg', {
            url: '/biz-msg',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/biz-msg.html';
                    }
                }
            }
        })
        .state('as-history', {
            url: '/as-history',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/as-history.html';
                    }
                }
            }
        })
        .state('premium-info', {
            url: '/premium-info',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/premium-info.html';
                    }
                }
            }
        })
        .state('contract-info', {
            url: '/contract-info',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/contract-info.html';
                    }
                }
            }
        })
        .state('req-estimation-create', {
            url: '/req-estimation-create',
            views: {
                'contents': {
                    templateUrl: function () {
                        return templatePath + 'admin/views/contents/req-estimation/create.html';
                    }
                }
            }
        });
}