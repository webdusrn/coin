export default function NavigationCtrl($scope, $state, $stateParams, metaManager) {
    "ngInject";

    var PREFIX = window.meta.std.prefix;

    var vm = $scope.vm;
    vm.isNavigationVisible = false;

    vm.ADMIN = metaManager.std.admin;
    vm.activeNav = '';

    vm.toggleNavigation = toggleNavigation;
    vm.activeMenu = activeMenu;
    vm.goIndex = goIndex;
    vm.goUser = goUser;
    vm.goNotice = goNotice;
    vm.goReport = goReport;
    vm.goTerms = goTerms;
    vm.goImage = goImage;
    vm.goNotification = goNotification;
    vm.goInfo = goInfo;
    vm.goLogin = goLogin;
    vm.goUser = goUser;
    vm.goMassNotification = goMassNotification;

    vm.goEngineer = goEngineer;
    vm.goReqEstimation = goReqEstimation;
    vm.goDeal = goDeal;
    vm.goOption = goOption;
    vm.goBlog = goBlog;
    vm.goEngineerPhoneNum = goEngineerPhoneNum;
    vm.goTransaction = goTransaction;
    vm.goPointHistory = goPointHistory;
    vm.goInstallCs = goInstallCs;
    vm.goVbank = goVbank;
    vm.goBizMsg = goBizMsg;
    vm.goAsHistory = goAsHistory;
    vm.goPremiumInfo = goPremiumInfo;
    vm.goContractInfo = goContractInfo;
    vm.goReqEstimationCreate = goReqEstimationCreate;

    function toggleNavigation() {
        vm.isNavigationVisible = vm.isNavigationVisible ? false : true;
    }

    function activeMenu(item) {
        item.active = true;
    }

    function afterItemClick() {
        vm.isNavigationVisible = false;
    }

    function goIndex() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleDashboardInfo);
        afterItemClick();
    }

    function goUser() {
        $state.go('user-info');
        afterItemClick();
    }

    function goMassNotification() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleMassNotifications);
        afterItemClick();
    }

    function goNotice() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleNotices);
        afterItemClick();
    }

    function goReport() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleReports);
        afterItemClick();
    }

    function goTerms() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleTerms);
        afterItemClick();
    }

    function goImage() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleImages);
        afterItemClick();
    }

    function goNotification() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleNotification);
        afterItemClick();
    }

    function goInfo() {
        $state.go(PREFIX.admin + '.' + vm.ADMIN.moduleCompanyInfo);
        afterItemClick();
    }

    function goLogin() {
        $state.go('login');
    }

    function goEngineer() {
        $state.go('engineer');
        afterItemClick();
    }

    function goReqEstimation() {
        $state.go('req-estimation');
        afterItemClick();
    }

    function goDeal() {
        $state.go('deal');
        afterItemClick();
    }

    function goOption () {
        $state.go('option');
        afterItemClick();
    }

    function goBlog () {
        $state.go('blog');
        afterItemClick();
    }

    function goEngineerPhoneNum () {
        $state.go('engineer-phone-num');
        afterItemClick();
    }

    function goTransaction () {
        $state.go('transaction');
        afterItemClick();
    }

    function goPointHistory () {
        $state.go('point-history');
        afterItemClick();
    }

    function goInstallCs () {
        $state.go('install-cs');
        afterItemClick();
    }

    function goVbank () {
        $state.go('vbank');
        afterItemClick();
    }

    function goBizMsg () {
        $state.go('biz-msg');
        afterItemClick();
    }

    function goAsHistory () {
        $state.go('as-history');
        afterItemClick();
    }

    function goPremiumInfo () {
        $state.go('premium-info');
        afterItemClick();
    }

    function goContractInfo () {
        $state.go('contract-info');
        afterItemClick();
    }

    function goReqEstimationCreate () {
        $state.go('req-estimation-create');
        afterItemClick();
    }

    // if (vm.session && vm.session.role >= vm.USER.roleEngineerAuthorized) {
    //     vm.isLoginVisible = false;
    //     vm.isContentVisible = true;
    // } else {
    //     vm.isLoginVisible = true;
    //     vm.isContentVisible = false;
    // }

    if (vm.session && vm.session.nick) {
        vm.nickImg = vm.session.nick.substring(0, 1);
    }

    $scope.$on(vm.ADMIN.kNavigation, function (event, args) {
        vm.activeNav = args.activeNav;
    });

}