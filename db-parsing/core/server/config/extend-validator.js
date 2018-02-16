var expressValidator = require('express-validator');

function extending() {

    expressValidator.validator.extend('isMobilePhoneNum', function (str) {
        if (str === '') return false;
        var reg = new RegExp("^[+]{1}[0-9]{4,17}$");
        return reg.test(str);
    });

    expressValidator.validator.extend('isMicroTimestamp', function (str) {
        if (str === '') return false;
        if (Number(str)) {
            str = str + '';
            if (str.length == 16) {
                return true;
            }
        }
        return false;
    });

    expressValidator.validator.extend('isVersion', function (str) {
        if (str === '') return false;
        var versionArr = str.split(".");
        if (versionArr.length == 3) {
            if (Number(versionArr[0]) > -1 && Number(versionArr[1]) > -1 && Number(versionArr[2]) > -1) {
                return true;
            }
        }
        return false;
    });

    expressValidator.validator.extend('isKeywords', function (str, keywords, isUpperCase, isOR) {
        if (str === '') return false;
        var count = 0;
        if (keywords instanceof Array && keywords.length > 0) {
            if (isUpperCase) {
                str = str.toUpperCase();
            }
            for (var i = 0; i < keywords.length; ++i) {
                var keyword = keywords[i];
                if (isUpperCase) {
                    keyword = keyword.toUpperCase();
                }
                if (str.indexOf(keyword) != -1) {
                    if (isOR) return true;
                    count++;
                }
            }
            return (count == keywords.length);
        }

        return false;
    });

    expressValidator.validator.extend('isAlphanumericPassword', function (str, min, max) {
        if (str === '') return false;
        var reg = new RegExp("^.*(?=.{" + min + "," + max + "})(?=.*[0-9])(?=.*[a-zA-Z]).*$");
        return reg.test(str);
    });

    expressValidator.validator.extend('isId', function (str, min, max) {
        if (str === '') return false;
        if (str.length < min || str.length > max) return false;
        var reg = new RegExp("^[a-z0-9]{" + min + "," + max + "}$");
        return reg.test(str);
    });

    expressValidator.validator.extend('isPos', function (str) {
        if (str === '') return false;

        var arr = str.split(',');
        var result = (arr.length != 2) ? false : true;

        if (result === true) {
            for (var i = 0; i < arr.length; ++i) {
                var value = Number(arr[i]);
                if (!value && value !== 0) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    });

    expressValidator.validator.extend('isObjectIds', function (str, maxCnt) {
        if (!maxCnt) maxCnt = 100;
        if (str === '') return false;

        var arr = str.split(',');
        var result = (arr.length > maxCnt) ? false : true;

        if (result === true) {
            for (var i = 0; i < arr.length; ++i) {
                var value = arr[i].replace(new RegExp(" ", "g"), "");
                if (value != '') {
                    if (!(value.length === 24) || (value.match(/^[0-9a-fA-F]+$/) === false)) {
                        result = false;
                        break;
                    }
                }
            }
        }
        return result;
    });

    expressValidator.validator.extend('isYear', function (str) {
        if (str === '') return false;
        var now = new Date();
        var result = Number(str);
        if (!result) return false;
        if (str < 1900 || str > now.getFullYear()) return false;
        return true;
    });

    expressValidator.validator.extend('isMonth', function (str) {
        if (str === '') return false;
        var result = Number(str);
        if (!result) return false;
        if (str < 1 || str > 12) return false;
        return true;
    });

    expressValidator.validator.extend('isDay', function (str) {
        if (str === '') return false;
        var result = Number(str);
        if (!result) return false;
        if (str < 1 || str > 31) return false;
        return true;
    });

    expressValidator.validator.extend('isOnlyError', function (str) {
        return false;
    });

    expressValidator.validator.extend('isEnum', function (str, enums) {
        var result = false;
        if (str === '') return true;
        for (var i = 0; i < enums.length; ++i) {
            enums[i] = enums[i] + "";
            if (enums[i] === str) {
                result = true;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isEnumArray', function (str, enums) {
        var result = true;
        if (str === '') return true;
        var arr = str.split(',');
        var enumHash = {};

        enums.forEach(function (item) {
            enumHash[item] = true;
        });

        arr.forEach(function (item) {
            if (!enumHash[item]) {
                result = false;
            }
        });

        return result;
    });

    expressValidator.validator.extend('isBoolean', function (str) {
        var result = false;
        if (str === '') return true;
        str = str + "";
        var booleans = ['true', 'false', '0', '1'];
        for (var i = 0; i < booleans.length; ++i) {
            booleans[i] = booleans[i] + "";
            if (booleans[i] === str) {
                result = true;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isRange', function (str, min, max) {
        if (str === '') return false;
        var num = Number(str);
        if (!num) return false;
        if (num >= min && num <= max) return true;
        else return false;
    });

    expressValidator.validator.extend('isImages', function (str, maxCnt) {
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');
        if (arr.length > maxCnt) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");
                arr[i] = arr[i].toLowerCase();
                //check image
                var result = arr[i].match(/\.(jpg|gif|png|jpeg)$/i);
                if (!result) break;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isTags', function (str, minLen, maxLen, maxCnt) {
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');
        if (arr.length > maxCnt) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");
                arr[i] = arr[i].toLowerCase();
                var result = arr[i].length <= maxLen && arr[i].length >= minLen;
                if (!result) break;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isEmails', function (str, maxCnt) {
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');
        if (arr.length > maxCnt) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");
                arr[i] = arr[i].toLowerCase();

                //check email
                var result = expressValidator.validator.isEmail(arr[i]);
                if (!result) break;
            }
        }
        return result;
    });

    expressValidator.validator.extend('isNumberIds', function (str, maxCnt) {
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');
        if (arr.length > maxCnt) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");

                if (!Number(arr[i])) {
                    return false;
                }
            }
        }
        return true;
    });

    expressValidator.validator.extend('isMonthArray', function (str, minCnt, maxCnt) {
        if (!minCnt) minCnt = 1;
        if (!maxCnt) maxCnt = 1;
        if (str === '') return false;
        var arr = str.split(',');

        //배열에 들어갈 최소, 최대 갯수 체크
        if (arr.length > maxCnt || arr.length < minCnt) {
            return false;
        } else {
            for (var i = 0; i < arr.length; ++i) {
                //trim
                arr[i] = arr[i].replace(/^\s*|\s*$/g, "");

                //Number가 아닌경우 false
                if (!Number(arr[i])) {
                    return false;
                }

                //Month가 아닌경우 false
                if (str < 1 || str > 12) {
                    return false;
                }
            }
        }
        return true;
    });

}

module.exports = extending;