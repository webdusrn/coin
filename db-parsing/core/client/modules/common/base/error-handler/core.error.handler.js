export default function errorHandler($filter, metaManager, $location) {
    "ngInject";

    var MAGIC = metaManager.magic;

    this.alertError = alertError;
    this.refineError = refineError;
    this.getErrorObject = getErrorObject;
    this.getFormError = getFormError;
    this.isInvalid = isInvalid;
    this.validator = validator;

    function validator (data, acceptableKeys, essentialKeys, resettableKeys, callback) {
        var self = this;
        try {
            var acceptableKeyHash = makeHash(acceptableKeys, function (err) {
                throw(err);
            });
            if (essentialKeys) {
                var essentialKeyHash = makeHash(essentialKeys, function (err) {
                    throw(err);
                });
            }
            if (resettableKeys) {
                var resettableKeyHash = makeHash(resettableKeys, function (err) {
                    throw(err);
                });
            }
            if (data instanceof Object) {
                for (var k in data) {
                    if (!acceptableKeyHash[k]) {
                        throw('400_15');
                    }
                    if (data[k] == MAGIC.reset) {
                        if (!resettableKeyHash[k]) {
                            throw('400_16');
                        }
                    }
                }
                if (essentialKeys) {
                    for (var k in essentialKeyHash) {
                        if (data[k] === undefined) {
                            throw('400_14');
                        }
                    }
                }
            } else {
                throw('400');
            }
            callback(data);
        } catch (err) {
            self.alertError(400, {
                code: err
            });
        }
    }

    function makeHash (arrayOrObject, failCallback) {
        var returnHash = {};
        if (arrayOrObject instanceof Array) {
            for (var i=0; i<arrayOrObject.length; i++) {
                returnHash[arrayOrObject[i]] = true;
            }
        } else if (arrayOrObject instanceof Object) {
            for (var k in arrayOrObject) {
                returnHash[k] = true;
            }
        } else {
            if (failCallback) {
                failCallback('400');
            }
        }
        return returnHash;
    }

    function isInvalid(ngNameObj) {
        if (angular.isDefined(ngNameObj)) {
            return !ngNameObj.$focus && ngNameObj.$invalid && ngNameObj.$dirty;
        }
        return false;
    }

    function getFormError(error) {
        if (!error) return "";
        if (error.required) return "400_53";
        if (error.email) return "400_1";
        if (error.minlength) return "400_51";
        if (error.maxlength) return "400_51";
        if (error.min) return "400_11";
        if (error.url) return "400_52";
        else return "400";
    }

    function alertError(status, data, redirectObj) {
        if (status >= 400) {
            if (data) {
                if (data instanceof Array) {
                    return alert($filter('translate')(data[0].code));
                } else if (data.code) {
                    if (redirectObj) {
                        if (data.code == redirectObj.code) {
                            return $location.path(redirectObj.url);
                        }
                    }
                    return alert($filter('translate')(data.code));
                } else {
                    return alert($filter('translate')(status));
                }
            } else {
                return alert($filter('translate')(status));
            }
        } else {
            return "";
        }
    }

    function refineError(status, data) {
        if (status >= 400) {
            if (data.data) {
                if (data.data instanceof Array) {
                    return $filter('translate')(data.data[0].code);
                } else if (data.data.code) {
                    return $filter('translate')(data.data.code);
                } else {
                    return $filter('translate')(status);
                }
            } else {
                return $filter('translate')(status);
            }
        } else {
            return "";
        }
    }

    function getErrorObject(status, data) {
        if (status >= 400) {
            if (data.data) {
                if (data.data instanceof Array) {
                    return data.data;
                } else if (data.data.code) {
                    return data.data.code;
                } else {
                    return status
                }
            } else {
                return status
            }
        } else {
            return null;
        }
    }
}