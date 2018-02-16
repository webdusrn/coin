var expressValidator = require('express-validator');

function extending() {
    expressValidator.validator.extend('isPos', function (str) {
        if (str === '') {
            return false;
        }
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
}

module.exports = extending;