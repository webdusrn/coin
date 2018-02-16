export default function reqEstimationsManager (ReqEstimation, ReqEstimationUser, UserPhone, IsCanPremium, IsCanContract, GeoGraphyInfo) {
    "ngInject";

    this.findReqEstimations = findReqEstimations;
    this.findReqEstimationById = findReqEstimationById;
    this.syncUser = syncUser;
    this.isCanPremium = isCanPremium;
    this.isCanContract = isCanContract;
    this.request = request;

    function request (data, callback) {
        var body = {};
        if (data.userId !== undefined) body.userId = data.userId;
        if (data.requestType !== undefined) body.requestType = data.requestType;
        if (data.category !== undefined) body.category = data.category;
        if (data.type !== undefined) body.type = data.type;
        if (data.authorName !== undefined) body.authorName = data.authorName;
        if (data.isPurchase !== undefined) body.isPurchase = data.isPurchase;
        if (data.isRecommendProduct !== undefined) body.isRecommendProduct = data.isRecommendProduct;
        if (data.visitDate !== undefined) body.visitDate = data.visitDate;
        if (data.visitTime !== undefined) body.visitTime = data.visitTime;
        if (data.visitDiscussion !== undefined) body.visitDiscussion = data.visitDiscussion;
        if (data.airConditionerType !== undefined) body.airConditionerType = data.airConditionerType;
        if (data.pyeong !== undefined) body.pyeong = data.pyeong;
        if (data.heater !== undefined) body.heater = data.heater;
        if (data.outDoorUnitStand !== undefined) body.outDoorUnitStand = data.outDoorUnitStand;
        if (data.installFloor !== undefined) body.installFloor = data.installFloor;
        if (data.separateFloor !== undefined) body.separateFloor = data.separateFloor;
        if (data.pipe !== undefined) body.pipe = data.pipe;
        if (data.baseWallHoleNum !== undefined) body.baseWallHoleNum = data.baseWallHoleNum;
        if (data.retainingWallHoleNum !== undefined) body.retainingWallHoleNum = data.retainingWallHoleNum;
        if (data.priceRange !== undefined) body.priceRange = data.priceRange;
        if (data.brand !== undefined) body.brand = data.brand;
        if (data.model !== undefined) body.model = data.model;
        if (data.reclamation !== undefined) body.reclamation = data.reclamation;
        if (data.ecoGas !== undefined) body.ecoGas = data.ecoGas;
        if (data.smartAirConditioner !== undefined) body.smartAirConditioner = data.smartAirConditioner;
        if (data.isGasFull !== undefined) body.isGasFull = data.isGasFull;
        if (data.amount !== undefined) body.amount = data.amount;
        if (data.memo !== undefined) body.memo = data.memo;

        if (data.tvType !== undefined) body.tvType = data.tvType;
        if (data.tvInch !== undefined) body.tvInch = data.tvInch;
        if (data.wallType !== undefined) body.wallType = data.wallType;
        if (data.bracketType !== undefined) body.bracketType = data.bracketType;
        if (data.hideSurrounding !== undefined) body.hideSurrounding = data.hideSurrounding;
        if (data.shelf !== undefined) body.shelf = data.shelf;

        if (data.oldDoorLock !== undefined) body.oldDoorLock = data.oldDoorLock;
        if (data.doorType !== undefined) body.doorType = data.doorType;
        if (data.doorLockType !== undefined) body.doorLockType = data.doorLockType;
        if (data.isNeedLockTypeOtp !== undefined) body.isNeedLockTypeOtp = data.isNeedLockTypeOtp;
        if (data.isNeedLockTypePassword !== undefined) body.isNeedLockTypePassword = data.isNeedLockTypePassword;
        if (data.isNeedLockTypeFingerVoice !== undefined) body.isNeedLockTypeFingerVoice = data.isNeedLockTypeFingerVoice;
        if (data.isNeedLockTypeCard !== undefined) body.isNeedLockTypeCard = data.isNeedLockTypeCard;
        if (data.isNeedSafetyHanger !== undefined) body.isNeedSafetyHanger = data.isNeedSafetyHanger;
        if (data.isNeedMilkHole !== undefined) body.isNeedMilkHole = data.isNeedMilkHole;
        if (data.isNeedDoorStopper !== undefined) body.isNeedDoorStopper = data.isNeedDoorStopper;
        if (data.isNeedDoorCloser !== undefined) body.isNeedDoorCloser = data.isNeedDoorCloser;

        if (data.windowScreenType !== undefined) body.windowScreenType = data.windowScreenType;
        if (data.installWindowAmount !== undefined) body.installWindowAmount = data.installWindowAmount;
        if (data.installDoorAmount !== undefined) body.installDoorAmount = data.installDoorAmount;
        if (data.installEtcAmount !== undefined) body.installEtcAmount = data.installEtcAmount;
        if (data.windowScreenSize !== undefined) body.windowScreenSize = data.windowScreenSize;

        if (data.boilerType !== undefined) body.boilerType = data.boilerType;
        if (data.boilerCapacity !== undefined) body.boilerCapacity = data.boilerCapacity;
        if (data.boilerVariety !== undefined) body.boilerVariety = data.boilerVariety;

        if (data.installLat !== undefined) body.installLat = data.installLat;
        if (data.installLng !== undefined) body.installLng = data.installLng;
        if (data.installPostcode !== undefined) body.installPostcode = data.installPostcode;
        if (data.installJibunAddress !== undefined) body.installJibunAddress = data.installJibunAddress;
        if (data.installRoadAddress !== undefined) body.installRoadAddress = data.installRoadAddress;
        if (data.installDetailAddress !== undefined) body.installDetailAddress = data.installDetailAddress;
        if (data.installSigungu !== undefined) body.installSigungu = data.installSigungu;
        if (data.installSido !== undefined) body.installSido = data.installSido;
        if (data.installParking !== undefined) body.installParking = data.installParking;
        if (data.separateLat !== undefined) body.separateLat = data.separateLat;
        if (data.separateLng !== undefined) body.separateLng = data.separateLng;
        if (data.separatePostcode !== undefined) body.separatePostcode = data.separatePostcode;
        if (data.separateJibunAddress !== undefined) body.separateJibunAddress = data.separateJibunAddress;
        if (data.separateRoadAddress !== undefined) body.separateRoadAddress = data.separateRoadAddress;
        if (data.separateDetailAddress !== undefined) body.separateDetailAddress = data.separateDetailAddress;
        if (data.separateSido !== undefined) body.separateSido = data.separateSido;
        if (data.separateSigungu !== undefined) body.separateSigungu = data.separateSigungu;
        if (data.separateParking !== undefined) body.separateParking = data.separateParking;
        if (data.generalImageIds !== undefined) body.generalImageIds = data.generalImageIds;
        if (data.installPlaceImageIds !== undefined) body.installPlaceImageIds = data.installPlaceImageIds;

        findGeoInfo(body, function (status, body) {
            if (status == 200) {
                var reqEstimationUser = new ReqEstimationUser(body);
                reqEstimationUser.$save(function (data) {
                    callback(201, data);
                }, function (data) {
                    callback(data.status, data.data);
                });
            } else {
                callback(400);
            }
        });
    }

    function findGeoInfo (body, callback) {
        var install = body.installSido + ' ' + (body.installSigungu ? body.installSigungu + ' ' : '') + (body.installDetailAddress || '');
        var separate = null;
        if (body.separateSido) {
            separate = body.separateSido + ' ' + (body.separateSigungu ? body.separateSigungu + ' ' : '') + (body.separateDetailAddress || '');
        }
        findLatLng(install, function (status, data) {
            if (status == 200) {
                body.installLat = data.lat;
                body.installLng = data.lng;
                if (separate) {
                    findLatLng(separate, function (status, data) {
                        if (status == 200) {
                            body.separateLat = data.lat;
                            body.separateLng = data.lng;
                            callback(200, body);
                        } else {
                            callback(status, data);
                        }
                    });
                } else {
                    callback(200, body);
                }
            } else {
                callback(status, data);
            }
        });
    }

    function findLatLng (searchItem, callback) {
        GeoGraphyInfo.get({
            searchItem: searchItem
        }, function (data) {
            if (data.channel.item && data.channel.item.length && data.channel.item[0].lat && data.channel.item[0].lng) {
                callback(200, {
                    lat: data.channel.item[0].lat,
                    lng: data.channel.item[0].lng
                });
            } else {
                var temp = searchItem.split(' ');
                findLatLng(temp.slice(0, temp.length - 1).join(' '), callback);
            }
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function isCanPremium (data, callback) {
        var query = {
            category: data.category,
            type: data.type,
            installSido: data.installSido
        };
        if (data.airConditionerType !== undefined) query.airConditionerType = data.airConditionerType;
        if (data.installSigungu !== undefined) query.installSigungu = data.installSigungu;
        if (data.isPurchase !== undefined) query.isPurchase = data.isPurchase;
        if (data.bracketType !== undefined) query.bracketType = data.bracketType;
        IsCanPremium.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function isCanContract (data, callback) {
        var query = {
            category: data.category,
            type: data.type,
            visitDate: data.visitDate,
            installSido: data.installSido
        };
        if (data.airConditionerType !== undefined) query.airConditionerType = data.airConditionerType;
        if (data.installSigungu !== undefined) query.installSigungu = data.installSigungu;
        if (data.isPurchase !== undefined) query.isPurchase = data.isPurchase;
        if (data.bracketType !== undefined) query.bracketType = data.bracketType;
        IsCanContract.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function syncUser (phoneNum, callback) {
        UserPhone.get({
            phoneNum: phoneNum
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findReqEstimations (query, callback) {
        ReqEstimation.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findReqEstimationById(id, callback){
        ReqEstimation.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

}