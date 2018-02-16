export default function ReqEstimationCtrl ($scope, errorHandler, loadingHandler, dialogHandler, reqEstimationsManager, metaManager, $uibModal) {
    "ngInject";

    var vm = $scope.vm;
    var COMMON = metaManager.std.common;
    var REQ_ESTIMATION = metaManager.std.reqEstimation;
    var PREMIUM_REQ_ESTIMATION = metaManager.std.premiumReqEstimation;
    var CONTRACT_REQ_ESTIMATION = metaManager.std.contractReqEstimation;
    var REQ_CALL = "콜당과금";
    var REQ_PREMIUM = "프리미엄";
    var REQ_CONTRACT = "도급";

    var defaultEnumStates = ["totalStates"];
    var enumCallStates = ["totalStates"].concat(REQ_ESTIMATION.enumCallStates);
    var enumPartnerStates = ["totalStates"].concat(REQ_ESTIMATION.enumPartnerStates);

    vm.activeNav = 'req-estimation';

    $scope.findReqEstimations = findReqEstimations;
    $scope.openDetailReqEstimation = openDetailReqEstimation;
    $scope.openStats = openStats;

    $scope.REQ_ESTIMATION = REQ_ESTIMATION;
    $scope.REQ_CALL = REQ_CALL;
    $scope.REQ_PREMIUM = REQ_PREMIUM;
    $scope.REQ_CONTRACT = REQ_CONTRACT;
    $scope.enumSearchFields = REQ_ESTIMATION.enumSearchFields.slice();
    $scope.enumRequestTypes = ["전체 신청 방식", REQ_CALL, REQ_PREMIUM, REQ_CONTRACT];
    $scope.enumTypes = ["totalReqEstimationType"].concat(REQ_ESTIMATION.enumTypes);
    $scope.enumStates = defaultEnumStates.slice();
    $scope.more = false;
    $scope.form = {
        orderBy: REQ_ESTIMATION.orderByCreatedAt,
        size: COMMON.defaultLoadingAdminLength,
        searchField: $scope.enumSearchFields[0],
        requestType: $scope.enumRequestTypes[0],
        state: "totalStates",
        type: $scope.enumTypes[0]
    };
    $scope.reqEstimations = {
        count: 0,
        rows: []
    };

    $scope.$watch('form.requestType', function (n, o) {
        if (n != o) {
            $scope.form.state = 'totalStates';
            if (n == REQ_CALL) {
                $scope.enumStates = enumCallStates.slice();
            } else if (n == REQ_PREMIUM || n == REQ_CONTRACT) {
                $scope.enumStates = enumPartnerStates.slice();
            } else {
                $scope.enumStates = defaultEnumStates;
            }
            findReqEstimations(true);
        }
    }, true);

    $scope.$watch('form.type', function (n, o) {
        if (n != o) {
            findReqEstimations(true);
        }
    }, true);

    $scope.$watch('form.state', function (n, o) {
        if (n != o) {
            findReqEstimations(true);
        }
    }, true);

    findReqEstimations(true);

    function findReqEstimations (refresh) {
        var last = null;
        if (refresh) {
            $scope.reqEstimations = {
                count: 0,
                rows: []
            };
        } else {
            last = $scope.reqEstimations.rows[$scope.reqEstimations.rows.length - 1][$scope.form.orderBy];
        }
        var query = angular.copy($scope.form);
        if (query.requestType == REQ_CALL) {
            query.requestType = REQ_ESTIMATION.requestTypeCall;
        } else if (query.requestType == REQ_PREMIUM) {
            query.requestType = REQ_ESTIMATION.requestTypePremium;
        } else if (query.requestType == REQ_CONTRACT) {
            query.requestType = REQ_ESTIMATION.requestTypeContract;
        } else {
            delete query.requestType;
        }
        if (query.requestType == $scope.enumRequestTypes[0]) delete query.requestType;
        if (query.type == $scope.enumTypes[0]) delete query.type;
        if (query.state == $scope.enumStates[0]) delete query.state;
        if (last) query.last = last;
        reqEstimationsManager.findReqEstimations(query, function (status, data) {
            if (status == 200) {
                generateRows(data.rows);
                if (refresh) {
                    $scope.reqEstimations = data;
                } else {
                    $scope.reqEstimations.rows = $scope.reqEstimations.rows.concat(data.rows);
                }
                $scope.more = $scope.reqEstimations.rows.length < $scope.reqEstimations.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateRows (rows) {
        for (var i=0; i<rows.length; i++) {
            generate(rows[i]);
        }
    }

    function generate (item) {
        if (item.requestType == REQ_ESTIMATION.requestTypeCall) {
            item.requestType = REQ_CALL;
            generateCall(item);
        } else {
            if (item.requestType == REQ_ESTIMATION.requestTypePremium) {
                item.requestType = REQ_PREMIUM;
            } else {
                item.requestType = REQ_CONTRACT;
            }
            generatePartner(item);
        }
    }

    function generateCall (item) {
        if (item.state == REQ_ESTIMATION.stateStandby) {
            item.state = REQ_ESTIMATION.callStateStandby;
        } else if (item.state == REQ_ESTIMATION.stateMatch && item.callCount == 0) {
            item.state = REQ_ESTIMATION.callStateStandby;
        } else if (item.state == REQ_ESTIMATION.stateMatch && item.callCount > 0 && item.transactionState == REQ_ESTIMATION.transactionStateStandby) {
            item.state = REQ_ESTIMATION.callStateCall;
        } else if (item.state == REQ_ESTIMATION.stateClose) {
            item.state = REQ_ESTIMATION.callStateClose;
        } else if (item.state == REQ_ESTIMATION.stateCancel) {
            item.state = REQ_ESTIMATION.callStateCancel;
        }
    }

    function generatePartner (item) {
        if (item.premiumReqEstimation) {
            if (item.state == PREMIUM_REQ_ESTIMATION.stateStandby) {
                item.state = REQ_ESTIMATION.partnerStateStandby;
            } else if (item.state == PREMIUM_REQ_ESTIMATION.stateCall) {
                item.state = REQ_ESTIMATION.partnerStateCall;
            } else if (item.state == PREMIUM_REQ_ESTIMATION.stateComplete && item.transactionState == PREMIUM_REQ_ESTIMATION.transactionStateSuccess) {
                item.state = REQ_ESTIMATION.partnerStateSuccess;
            } else if (item.state == PREMIUM_REQ_ESTIMATION.stateComplete && item.transactionState == PREMIUM_REQ_ESTIMATION.transactionStateFail) {
                item.state = REQ_ESTIMATION.partnerStateFail;
            }
        } else if (item.contractReqEstimation) {
            if (item.state == CONTRACT_REQ_ESTIMATION.stateStandby) {
                item.state = REQ_ESTIMATION.partnerStateStandby;
            } else if (item.state == CONTRACT_REQ_ESTIMATION.stateCall) {
                item.state = REQ_ESTIMATION.partnerStateCall;
            } else if (item.state == CONTRACT_REQ_ESTIMATION.stateComplete && item.transactionState == CONTRACT_REQ_ESTIMATION.transactionStateSuccess) {
                item.state = REQ_ESTIMATION.partnerStateSuccess;
            } else if (item.state == CONTRACT_REQ_ESTIMATION.stateComplete && item.transactionState == CONTRACT_REQ_ESTIMATION.transactionStateFail) {
                item.state = REQ_ESTIMATION.partnerStateFail;
            }
        }
    }

    function openDetailReqEstimation(size, reqEstimation) {

        var createInstance = $uibModal.open({
            animation: false,
            backdrop: true,
            templateUrl: 'myDetailReqEstimation.html',
            controller: 'DetailReqEstimationCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                },
                reqEstimation: function () {
                    return reqEstimation;
                },
                generate: function () {
                    return generate;
                }
            }
        });

        createInstance.result.then(function (result) {
            vm.modalOpen = false;
        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page")
        });
    }

    function openStats (size) {
        var instance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'myReqEstimationStats.html',
            controller: 'ReqEstimationStatsCtrl',
            size: size,
            resolve: {
                VM: function () {
                    return vm;
                }
            }
        });

        instance.result.then(function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        }, function () {
            vm.modalOpen = false;
            console.log("cancel modal page");
        });
    }
}