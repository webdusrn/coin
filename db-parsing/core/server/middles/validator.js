module.exports = function () {
    return function (aParameterKeys, aEssentialKeys, aResetAvailableKeys) {

        return function (req, res, next) {
            var MAGIC = req.meta.std.magic;

            var data = {};
            var bSuccess = true;

            var isQuery = false;
            for (var k in req.query) {
                isQuery = true;
            }

            if (req.query !== undefined && req.query !== null && isQuery) {
                data = req.query;
            }
            else {
                data = req.body || {};
            }

            // 서버단 코드에서 적절하게 배열을 채우지 않은 경우.
            if (!aParameterKeys || !aEssentialKeys || !aResetAvailableKeys) {
                bSuccess = false;
                return res.hjson(req, next, 500);
            }

            var essentialDataCnt = 0;
            var dataCnt = 0;

            // 키마다 양옆 여백 제거.
            // 값없는 키 제거.
            for (var k in data) {

                // sanitize.trim버그. false인식못함. 따라서 문자열로 바꿔줌.
                if (data[k] !== false && data[k] !== 'false' && data[k] instanceof String) {
                    data[k] = req.utils.string.trim(data[k]);
                }
                if (data[k] === false) {
                    data[k] = 'false';
                }
                if (data[k] === 0) {
                    data[k] = '0';
                }
                if (data[k] === undefined || data[k] === '' || data[k] === null || data[k] == 'null' || (Array.isArray(data[k]) && data[k].length === 0)) {
                    delete data[k];
                }
                else {
                    var bReset = false;
                    dataCnt++;
                    if (data[k] === MAGIC.reset) {

                        for (var i = 0; i < aResetAvailableKeys.length; ++i) {
                            if (aResetAvailableKeys[i] == k) {
                                bReset = true;
                                break;
                            }
                        }

                        if (!bReset) {
                            bSuccess = false;
                            return res.hjson(req, next, 400, {
                                code: '400_16',
                                data: data,
                                essentialData: aEssentialKeys
                            });

                        }
                    }
                }
            }

            var len = 0;
            for (var i = 0, len = aParameterKeys.length; i < len; ++i) {
                if (data[aParameterKeys[i]]) {
                    essentialDataCnt++;
                }
            }

            // 요청 쿼리의 숫자가 정해진 데이터의 숫자보다 많을 때 (필요없는 쿼리문이 껴잇을경우) 예외처리.
            if (essentialDataCnt < dataCnt) {
                bSuccess = false;
                if (req.files && req.files.length && req.removeFiles) {
                    req.removeFiles(function () {
                    });
                }
                return res.hjson(req, next, 400, {
                    code: '400_15'
                });
            }

            // 필수 파라미터가 없을때 처리.
            for (var i = 0; i < aEssentialKeys.length; ++i) {

                var exist = true;
                var customErrorCode;

                if (aEssentialKeys[i] instanceof Object) {
                    var keys = Object.keys(aEssentialKeys[i]);

                    if (!data[keys[0]]) {
                        exist = false;

                        if (keys.length > 0) {
                            customErrorCode = aEssentialKeys[i][keys[0]];
                        }
                    }

                } else {

                    if (!data[aEssentialKeys[i]]) {
                        exist = false;
                    }
                }


                if (!exist) {
                    bSuccess = false;
                    if (req.files && req.files.length && req.removeFiles) {
                        req.removeFiles(function () {
                        });
                    }

                    return res.hjson(req, next, 400, {
                        code: customErrorCode || '400_14'
                    });
                }
            }
            if (bSuccess) {
                next();
            }

        };
    };
};
