
navigator.$inject = ['$document', '$state', 'metaManager'];

export default function navigator($document, $state, metaManager) {
    "ngInject";

    var PREFIX = metaManager.std.prefix;
    var ADMIN = metaManager.std.admin;

    this.setBeforeCallback = null;
    this.setCompleteCallback = null;
    this.goToIndex = goToIndex;
    this.goTo404 = goTo404;
    this.goTo = goTo;
    this.goToEngineer = goToEngineer;
    this.goToReqEstimation = goToReqEstimation;
    this.goToLogin = goToLogin;
    this.goToUsers = goToUsers;
    this.goToOption = goToOption;
    this.goToBlog = goToBlog;
    this.goToPointHistory = goToPointHistory;
    this.goToInstallCs = goToInstallCs;
    this.goToVbnak = goToVbnak;
    this.goToBizMsg = goToBizMsg;
    this.goToAsHistory = goToAsHistory;
    this.goToPremiumInfo = goToPremiumInfo;
    this.goToContractInfo = goToContractInfo;
    this.goToReqEstimationCreate = goToReqEstimationCreate;



    var self = this;

    function goTo (name, param, reload, callback) {
        if (self.setBeforeCallback) {
            self.setBeforeCallback();
        }

        $state.go(name, param, {
            reload: reload
        }).then(function () {
            goToTop();
            if (self.setCompleteCallback) {
                self.setCompleteCallback();
            }
            if (callback) {
                callback();
            }
        });
    }


    function goToTop() {
        $document.scrollTop(0, 500);
    }

    function goToIndex () {
        goTo("index");
    }

    function goTo404 () {
        goTo("not-found");
    }


    function goToEngineer(){
        goTo("engineer");
    }

    function goToReqEstimation(){
        goTo("req-estimation");
    }

    function goToLogin () {
        goTo("login");
    }

    function goToUsers () {
        goTo("user-info");
    }

    function goToOption () {
        goTo("option");
    }

    function goToBlog () {
        goTo('blog');
    }

    function goToPointHistory () {
        goTo('point-history');
    }

    function goToInstallCs () {
        goTo('install-cs');
    }

    function goToVbnak () {
        goTo('vbank');
    }
    
    function goToBizMsg () {
        goTo('biz-msg');
    }

    function goToAsHistory () {
        goTo('as-history');
    }

    function goToPremiumInfo () {
        goTo('premium-info');
    }

    function goToContractInfo () {
        goTo('contract-info');
    }

    function goToReqEstimationCreate () {
        goTo('req-estimation-create');
    }
}