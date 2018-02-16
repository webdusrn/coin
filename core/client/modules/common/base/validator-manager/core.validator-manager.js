export default function apiValidator(Validator, dialogHandler) {
    "ngInject";

    function ValidateManager() {
        this.checkList = [];
        this.errorResults = [];
    }

    ValidateManager.prototype.check = function (str, errorCode) {
        var validator = new Validator(str, errorCode);
        this.checkList.push(validator);
        return validator;
    };

    ValidateManager.prototype.checkError = function (body, callback) {
        var checkList = this.checkList;
        var errorResults = this.errorResults;

        for (var i = 0; i < checkList.length; i++) {

            if (body[checkList[i].getParam()] !== undefined) {
                checkList[i].setValue(body[checkList[i].getParam()]);

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
            dialogHandler.alertError(400, {
                code: errorResults[0].code
            });
        } else {
            callback();
        }

        this.checkList = [];
        this.errorResults = [];
    };

   return new ValidateManager();
}