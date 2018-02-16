export default function ReqEstimationCreateCtrl ($scope, $filter, metaManager, dialogHandler, reqEstimationsManager) {
    'ngInject';

    var vm = $scope.vm;
    var translate = $filter('translate');
    var COMMON = metaManager.std.common;
    var REQ_ESTIMATION = metaManager.std.reqEstimation;
    var BOILER = REQ_ESTIMATION.boiler;
    var DOOR_LOCK = REQ_ESTIMATION.doorLock;
    var WALL_TV = REQ_ESTIMATION.wallTv;
    var WINDOW_SCREEN = REQ_ESTIMATION.windowScreen;
    var addressFields = metaManager.std.addressFields.slice();
    var addressHash = {};
    addressFields.forEach(function (address, index) {
        addressHash[address.name] = index;
    });
    var enumBoilerProducts = BOILER.enumBoilerProducts.slice();
    var phoneExp = new RegExp("^01[016789]{1}[0-9]{7,8}$");

    vm.activeNav = 'req-estimation-create';

    $scope.refresh = refresh;
    $scope.syncUser = syncUser;
    $scope.asyncUser = asyncUser;
    $scope.request = request;
    $scope.isCanPremium = isCanPremium;
    $scope.isCanContract = isCanContract;
    $scope.requestCall = requestCall;
    $scope.requestPremium = requestPremium;
    $scope.requestContract = requestContract;

    $scope.templatePath = metaManager.std.templatePath;
    $scope.REQ_ESTIMATION = REQ_ESTIMATION;
    $scope.BOILER = BOILER;

    $scope.enumTypes = REQ_ESTIMATION.enumTypes.slice();
    $scope.enumVisitTimes = REQ_ESTIMATION.enumVisitTimes.slice();
    $scope.enumInstallSidos = addressFields.slice();
    $scope.enumInstallSigungus = [];
    $scope.enumSeparateSidos = addressFields.slice();
    $scope.enumSeparateSigungus = [];
    $scope.enumAirConditionerTypes = REQ_ESTIMATION.enumAirConditionerTypes.slice();
    $scope.enumHeaters = REQ_ESTIMATION.enumHeaters.slice();
    $scope.enumIsPurchases = ["신품구매", "보유제품"];
    $scope.enumOutDoorUnitStands = REQ_ESTIMATION.enumOutDoorUnitStands.slice();
    $scope.enumReclamations = ["매립형", "비매립형", "모르겠음"];
    $scope.enumParkings = REQ_ESTIMATION.enumParkings.slice();
    $scope.enumIsGasFulls = ["예", "아니오"];
    $scope.enumEcoGas = REQ_ESTIMATION.enumEcoGas;
    $scope.enumBoilerTypes = BOILER.enumBoilerTypes;
    $scope.enumBoilerCapacities = [];
    $scope.enumBoilerBrands = [];
    $scope.enumBoilerProducts = [];
    $scope.enumOldDoorLocks = DOOR_LOCK.enumOldDoorLocks.slice();
    $scope.enumDoorTypes = DOOR_LOCK.enumDoorTypes.slice();
    $scope.enumDoorLockTypes = DOOR_LOCK.enumDoorLockTypes.slice();
    $scope.enumPriceRanges = REQ_ESTIMATION.enumPriceRanges.slice();
    $scope.enumBracketTypes = WALL_TV.enumBracketTypes.slice();
    $scope.enumHideSurroundings = WALL_TV.enumHideSurroundings.slice();
    $scope.enumTvTypes = WALL_TV.enumTvTypes.slice();
    $scope.enumShelves = WALL_TV.enumShelves.slice();
    $scope.enumWindowScreenTypes = WINDOW_SCREEN.enumWindowScreenTypes.slice();

    var defaultFormFields = [
        'phoneNum',
        'type',
        'visitDate',
        'visitTime',
        'installSido',
        'installSigungu',
        'installDetailAddress',
        'installParking'
    ];

    $scope.form = {};
    $scope.user = null;

    // $scope.$watch('form', function (n, o) {
    //     if (n != o) {
    //         console.log(n);
    //     }
    // }, true);

    $scope.$watch('form.type', function (n, o) {
        if (n != o) {
            var form = {};
            defaultFormFields.forEach(function (field) {
                form[field] = $scope.form[field];
            });
            $scope.form = form;
            if (n == REQ_ESTIMATION.typeBoilerInstall) {
                $scope.form.category = REQ_ESTIMATION.categoryBoilerInstall;
                $scope.form.boilerVariety = '상관없음';
            } else if (n == REQ_ESTIMATION.typeBoilerRepair) {
                $scope.form.category = REQ_ESTIMATION.categoryBoilerRepair;
                $scope.form.boilerVariety = '모르겠음';
            } else if (n == REQ_ESTIMATION.typeDoorLockInstall) {
                $scope.form.category = REQ_ESTIMATION.categoryEtcInstall;
                $scope.form.isNeedLockTypeOtp = false;
                $scope.form.isNeedLockTypePassword = false;
                $scope.form.isNeedLockTypeFingerVoice = false;
                $scope.form.isNeedLockTypeCard = false;
                $scope.form.isNeedSafetyHanger = false;
                $scope.form.isNeedMilkHole = false;
                $scope.form.isNeedDoorStopper = false;
                $scope.form.isNeedDoorCloser = false;
            } else if (n == REQ_ESTIMATION.typeWindowScreenInstall) {
                $scope.form.category = REQ_ESTIMATION.categoryEtcInstall;
                $scope.form.installWindowAmount = 0;
                $scope.form.installDoorAmount = 0;
                $scope.form.installEtcAmount = 0;
            } else if (n == REQ_ESTIMATION.typeWallTvInstall) {
                $scope.form.category = REQ_ESTIMATION.categoryWallTvInstall;
            } else if (n == REQ_ESTIMATION.typeInstallOnly || n == REQ_ESTIMATION.typeMoveInstall || n == REQ_ESTIMATION.typeOutDoorUnitInstall) {
                $scope.form.category = REQ_ESTIMATION.categoryAirConditionerInstall;
            } else if (n == REQ_ESTIMATION.typeRemove || n == REQ_ESTIMATION.typeGasCharge) {
                $scope.form.category = REQ_ESTIMATION.categoryAirConditionerManage;
            }
        }
    }, true);

    $scope.$watch('form.installSido', function (n, o) {
        if (n != o) {
            $scope.form.installSigungu = '';
            if (n) {
                var list = addressFields[addressHash[n]].list.slice();
                $scope.enumInstallSigungus = list.slice(1, list.length);
            } else {
                $scope.enumInstallSigungus = [];
            }
        }
    }, true);

    $scope.$watch('form.separateSido', function (n, o) {
        if (n != o) {
            $scope.form.separateSigungu = '';
            if (n) {
                var list = addressFields[addressHash[n]].list.slice();
                $scope.enumSeparateSigungus = list.slice(1, list.length);
            } else {
                $scope.enumSeparateSigungus = [];
            }
        }
    }, true);

    $scope.$watch('form.isPurchase', function (n, o) {
        if (n != o) {
            $scope.form.priceRange = '';
        }
    }, true);

    $scope.$watch('form.boilerType', function (n, o) {
        if (n != o) {
            $scope.form.boilerCapacity = '';
            $scope.enumBoilerCapacities = [];
            if ($scope.form.type == REQ_ESTIMATION.typeBoilerInstall) {
                if (n) {
                    $scope.enumBoilerCapacities = BOILER.enumBoilerCapacities.install[n];
                }
            } else if ($scope.form.type = REQ_ESTIMATION.typeBoilerRepair) {
                $scope.form.brand = '';
                $scope.enumBoilerBrands = [];
                if (n) {
                    $scope.enumBoilerCapacities = BOILER.enumBoilerCapacities.repair[n];
                    $scope.enumBoilerBrands = BOILER.enumBoilerBrands.repair[n];
                }
            }
        }
    }, true);

    $scope.$watch('form.boilerCapacity', function (n, o) {
        if (n != o) {
            if ($scope.form.type == REQ_ESTIMATION.typeBoilerInstall) {
                $scope.form.brand = '';
                $scope.enumBoilerBrands = [];
                if (n) {
                    if ($scope.form.boilerType == BOILER.boilerTypeGas) {
                        $scope.enumBoilerBrands = BOILER.enumBoilerBrands.install[$scope.form.boilerType][$scope.form.boilerVariety];
                    } else {
                        $scope.enumBoilerBrands = BOILER.enumBoilerBrands.install[$scope.form.boilerType];
                    }
                }
            }
        }
    }, true);

    $scope.$watch('form.brand', function (n, o) {
        if (n != o) {
            if ($scope.form.type == REQ_ESTIMATION.typeBoilerInstall) {
                $scope.form.boilerProduct = '';
                $scope.enumBoilerProducts = [{
                    model: '전문가추천'
                }];
                if (n) {
                    enumBoilerProducts.forEach(function (boilerProduct) {
                        var isInclude = true;
                        if (n != '상관없음') {
                            isInclude = boilerProduct.brand == n;
                        }
                        if (isInclude) isInclude = boilerProduct.capacity == $scope.form.boilerCapacity;
                        if (isInclude) {
                            $scope.enumBoilerProducts.push(boilerProduct);
                        }
                    });
                }
            }
        }
    }, true);

    function generateBody () {
        var body = angular.copy($scope.form);
        if ($scope.user) body.userId = $scope.user.id;
        if (body.isPurchase == $scope.enumIsPurchases[0]) {
            body.isPurchase = true;
        } else if (body.isPurchase == $scope.enumIsPurchases[1]) {
            body.isPurchase = false;
        }
        if (body.reclamation == $scope.enumReclamations[0]) {
            body.reclamation = true;
        } else if (body.reclamation == $scope.enumReclamations[1]) {
            body.reclamation = false;
        } else if (body.reclamation == $scope.enumReclamations[2]) {
            body.reclamation = null;
        }
        if (body.type == REQ_ESTIMATION.typeGasCharge) {
            if (body.isGasFull == $scope.enumIsGasFulls[0]) {
                body.isGasFull = true;
            } else if (body.isGasFull == $scope.enumIsGasFulls[1]) {
                body.isGasFull = false;
            }
        }
        if (body.type == REQ_ESTIMATION.typeBoilerInstall) {
            if (body.boilerProduct == '전문가추천') {
                body.isRecommendProduct = true;
            } else {
                body.model = body.boilerProduct;
                body.isRecommendProduct = false;
            }
        }
        if (body.type == REQ_ESTIMATION.typeDoorLockInstall) {
            if (body.isPurchase) {
                body.isRecommendProduct = !body.model;
            } else {
                body.priceRange = '';
            }
        }
        if (body.type == REQ_ESTIMATION.typeWallTvInstall) {
            if (body.tvInch !== undefined && body.tvInch >= 0) {
                body.tvInch += '인치';
            }
            if (!body.tvType) body.tvType = REQ_ESTIMATION.wallTv.tvTypeNoIdea;
            if (!body.wallType) body.wallType = translate(REQ_ESTIMATION.noIdea);
            if (!body.shelf) body.shelf = REQ_ESTIMATION.wallTv.shelfNoIdea;
        }
        if (!body.installParking) {
            body.installParking = REQ_ESTIMATION.defaultParking;
        }
        if (body.type == REQ_ESTIMATION.typeInstallOnly || body.type == REQ_ESTIMATION.typeMoveInstall || body.type == REQ_ESTIMATION.typeOutDoorUnitInstall) {
            if (!body.outDoorUnitStand) body.outDoorUnitStand = REQ_ESTIMATION.outDoorUnitStandNoIdea;
        }
        if (body.type == REQ_ESTIMATION.typeMoveInstall) {
            if (!body.separateParking) body.separateParking = REQ_ESTIMATION.defaultParking;
        }
        body.visitDiscussion = body.visitTime == REQ_ESTIMATION.visitTime9;
        return body;
    }
    
    function requestCall () {
        $scope.form.requestType = REQ_ESTIMATION.requestTypeCall;
        request();
    }
    
    function requestPremium () {
        $scope.form.requestType = REQ_ESTIMATION.requestTypePremium;
        request();
    }
    
    function requestContract () {
        $scope.form.requestType = REQ_ESTIMATION.requestTypeContract;
        request();
    }

    function request () {
        var body = generateBody();
        if (validation(body)) {
            reqEstimationsManager.request(body, function (status, data) {
                if (status == 201) {
                    dialogHandler.show('', '신청 완료됐습니다.', '', true);
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        }
    }
    
    function syncUser () {
        if (phoneExp.test($scope.form.phoneNum)) {
            reqEstimationsManager.syncUser($scope.form.phoneNum, function (status, data) {
                if (status == 200) {
                    $scope.user = data;
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        } else {
            dialogHandler.show('', '잘못된 핸드폰 번호입니다.', '', true);
        }
    }
    
    function asyncUser () {
        $scope.form.phoneNum = '';
        $scope.user = null;
    }
    
    function isCanPremium (refresh) {
        if (refresh) {
            delete $scope.form.isCanPremium;
        } else {
            var query = generateBody();
            query.requestType = REQ_ESTIMATION.requestTypePremium;
            if (validation(query)) {
                reqEstimationsManager.isCanPremium(query, function (status, data) {
                    if (status == 200) {
                        $scope.form.isCanPremium = data.isCanPremium;
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            }
        }
    }
    
    function isCanContract (refresh) {
        if (refresh) {
            delete $scope.form.isCanContract;
        } else {
            var query = generateBody();
            query.requestType = REQ_ESTIMATION.requestTypeContract;
            if (validation(query)) {
                reqEstimationsManager.isCanContract(query, function (status, data) {
                    if (status == 200) {
                        $scope.form.isCanContract = data.isCanContract;
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            }
        }
    }

    function validation (body) {
        if (!body.userId) {
            dialogHandler.show('', '유저 동기화 해주세요.', '', true);
            return false;
        }
        if (!body.requestType) {
            dialogHandler.show('', '견적 요청 방식을 선택하세요.', '', true);
            return false;
        }
        if (!body.visitDate) {
            dialogHandler.show('', '방문일이 없습니다.', '', true);
            return false;
        }
        if (!body.visitTime) {
            dialogHandler.show('', '방문시간이 없습니다.', '', true);
            return false;
        }
        if (!body.authorName) {
            dialogHandler.show('', '요청자명이 없습니다.', '', true);
            return false;
        }
        if (!body.installSido) {
            dialogHandler.show('', '주소 시/도 가 없습니다.', '', true);
            return false;
        }
        if (!body.installSigungu) {
            dialogHandler.show('', '주소 시/군/구 가 없습니다.', '', true);
            return false;
        }

        if (body.type == REQ_ESTIMATION.typeInstallOnly) {
            if (!body.airConditionerType) {
                dialogHandler.show('', '에어컨 유형이 없습니다.', '', true);
                return false;
            }
            if (!body.pyeong) {
                dialogHandler.show('', '평수가 없습니다.', '', true);
                return false;
            }
            if (!body.heater) {
                dialogHandler.show('', '냉난방기 여부를 선택해주세요.', '', true);
                return false;
            }
            if (body.isPurchase !== true && body.isPurchase !== false) {
                dialogHandler.show('', '신품 구매 여부를 선택해주세요.', '', true);
                return false;
            }
            if (!body.amount) {
                dialogHandler.show('', '설치 수량이 없습니다.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeMoveInstall) {
            if (!body.separateSido) {
                dialogHandler.show('', '철거주소 시/도 가 없습니다.', '', true);
                return false;
            }
            if (!body.separateSigungu) {
                dialogHandler.show('', '철거주소 시/군/구 가 없습니다.', '', true);
                return false;
            }
            if (!body.airConditionerType) {
                dialogHandler.show('', '에어컨 유형이 없습니다.', '', true);
                return false;
            }
            if (!body.pyeong) {
                dialogHandler.show('', '평수가 없습니다.', '', true);
                return false;
            }
            if (!body.heater) {
                dialogHandler.show('', '냉난방기 여부를 선택해주세요.', '', true);
                return false;
            }
            if (!body.amount) {
                dialogHandler.show('', '설치 수량이 없습니다.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeOutDoorUnitInstall) {
            if (!body.airConditionerType) {
                dialogHandler.show('', '에어컨 유형이 없습니다.', '', true);
                return false;
            }
            if (!body.pyeong) {
                dialogHandler.show('', '평수가 없습니다.', '', true);
                return false;
            }
            if (!body.heater) {
                dialogHandler.show('', '냉난방기 여부를 선택해주세요.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeRemove) {
            if (!body.airConditionerType) {
                dialogHandler.show('', '에어컨 유형이 없습니다.', '', true);
                return false;
            }
            if (!body.pyeong) {
                dialogHandler.show('', '평수가 없습니다.', '', true);
                return false;
            }
            if (!body.amount) {
                dialogHandler.show('', '설치 수량이 없습니다.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeGasCharge) {
            if (!body.airConditionerType) {
                dialogHandler.show('', '에어컨 유형이 없습니다.', '', true);
                return false;
            }
            if (!body.pyeong) {
                dialogHandler.show('', '평수가 없습니다.', '', true);
                return false;
            }
            if (body.isGasFull !== true ** body.isGasFull !== false) {
                dialogHandler.show('', '완충 여부를 선택해주세요.', '', true);
                return false;
            }
            if (!body.ecoGas) {
                dialogHandler.show('', '친환경 냉매 여부를 선택해주세요.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeWallTvInstall) {
            if (!body.tvInch) {
                dialogHandler.show('', '인치가 없습니다.', '', true);
                return false;
            }
            if (!body.bracketType) {
                dialogHandler.show('', '브라켓 구매 여부를 선택해주세요.', '', true);
                return false;
            }
            if (!body.hideSurrounding) {
                dialogHandler.show('', '주변기기 시공여부를 선택해주세요.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeDoorLockInstall) {
            if (!body.oldDoorLock) {
                dialogHandler.show('', '기존 도어락 유무를 선택해주세요.', '', true);
                return false;
            }
            if (body.isPurchase !== true && body.isPurchase !== false) {
                dialogHandler.show('', '신품 구매 여부를 선택해주세요.', '', true);
                return false;
            }
            if (!body.doorType) {
                dialogHandler.show('', '문 종류를 선택해주세요.', '', true);
                return false;
            }
            if (!body.doorLockType) {
                dialogHandler.show('', '도어락 유형을 선택해주세요.', '', true);
                return false;
            }
            if (!body.priceRange && body.isPurchase) {
                dialogHandler.show('', '가격대를 선택해주세요.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeWindowScreenInstall) {
            if (!body.windowScreenType) {
                dialogHandler.show('', '망 종류를 선택해주세요.', '', true);
                return false;
            }
            if (!body.installWindowAmount && !body.installDoorAmount && !body.form.installEtcAmount) {
                dialogHandler.show('', '설치할 갯수를 입력해주세요.', '', true);
                return false;
            }
            if (!body.windowScreenSize) {
                dialogHandler.show('', '사이즈 설명을 적어주세요.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeBoilerInstall) {
            if (!body.boilerType) {
                dialogHandler.show('', '보일러 유형을 선택해주세요.', '', true);
                return false;
            }
            if (!body.boilerCapacity) {
                dialogHandler.show('', '보일러 용량을 선택해주세요.', '', true);
                return false;
            }
            if (!body.brand) {
                dialogHandler.show('', '보일러 브랜드를 선택해주세요.', '', true);
                return false;
            }
            if (body.boilerType == REQ_ESTIMATION.boiler.boilerTypeGas && body.isRecommendProduct === undefined) {
                dialogHandler.show('', '상품을 선택해주세요.', '', true);
                return false;
            }
        } else if (body.type == REQ_ESTIMATION.typeBoilerRepair) {
            if (!body.boilerType) {
                dialogHandler.show('', '보일러 유형을 선택해주세요.', '', true);
                return false;
            }
            if (!body.boilerCapacity) {
                dialogHandler.show('', '보일러 용량을 선택해주세요.', '', true);
                return false;
            }
            if (!body.brand) {
                dialogHandler.show('', '보일러 브랜드를 선택해주세요.', '', true);
                return false;
            }
        } else {
            dialogHandler.show('', '설치 유형을 선택해주세요.', '', true);
            return false;
        }

        return true;
    }

    function refresh () {
        asyncUser();
        $scope.form = {};
    }
}