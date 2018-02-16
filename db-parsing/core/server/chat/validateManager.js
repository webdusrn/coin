var STD = require('../../../bridge/metadata/standards');
var Validator = require('./validator');


function ValidateManager() {
    this.checkList = [];
    this.errorResults = [];
}

ValidateManager.prototype.check = function (str, errorCode) {
    var validator = new Validator(str, errorCode);
    this.checkList.push(validator);
    return validator;
};

ValidateManager.prototype.checkError = function (socket, payload, next) {
    var checkList = this.checkList;
    var errorResults = this.errorResults;

    for (var i = 0; i < checkList.length; i++) {

        if (payload[checkList[i].getParam()] !== undefined) {
            checkList[i].setValue(payload[checkList[i].getParam()]);

            if (!checkList[i].isValidate()) {
                errorResults.push({
                    "param": checkList[i].getParam(),
                    "value": checkList[i].getValue(),
                    "code": checkList[i].getCode()
                })
            }
        } else {
            errorResults.push({
                "param": checkList[i].getParam(),
                "value": checkList[i].getValue(),
                "code": "400_14"
            })
        }
    }

    if (this.errorResults.length > 0) {
        socket.emit(STD.chat.serverRequestFail, 400, errorResults);
    } else {
        next();
    }

    this.checkList = [];
    this.errorResults = [];
};

module.exports = new ValidateManager();