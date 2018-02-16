export default function sessionValidationManager(metaManager, validateManager, dialogHandler) {
    "ngInject";

    var USER = metaManager.std.user;

    this.emailLoginValidate = emailLoginValidate;
    this.sigUpTypeEmailValidate = sigUpTypeEmailValidate;

    function emailLoginValidate(body, callback) {

        dialogHandler.validator(body, [
            "type",
            "uid",
            "secret"
        ], [
            "type",
            {
                "uid": "400_80"
            },
            {
                "secret": "400_81"
            }
        ], null, function () {
            validateManager.check('type', '400_3').isEnum(USER.enumSignUpTypes);
            validateManager.check('uid', '400_1').isEmail();
            validateManager.check('secret', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
            validateManager.checkError(body, callback);
        });
    }

    function sigUpTypeEmailValidate(body, essentials, callback) {

        if (!essentials) {
            essentials = [
                "type",
                {
                    "uid": "400_80"
                },
                {
                    "secret": "400_81"
                }
            ];
        }

        dialogHandler.validator(body, [
            'type',
            'provider',
            'uid',
            'secret',
            'nick',
            'aid',
            'apass',
            'name',
            'gender',
            'birthYear',
            'birthMonth',
            'birthDay',
            'country',
            'language',
            'agreedEmail',
            'agreedPhoneNum',
            'platform',
            'device',
            'version',
            'token',
            'optionalTerms',
            'transactionNo'
        ], essentials, null, function () {
            validateManager.check('type', '400_3').isEnum(USER.enumSignUpTypes);
            validateManager.check('uid', '400_1').isEmail();
            validateManager.check('secret', '400_2').isAlphanumericPassword(USER.minSecretLength, USER.maxSecretLength);
            if (body.name !== undefined) {
                validateManager.check('name', '400_73').len(USER.minNameLength, USER.maxNameLength);
            }
            validateManager.checkError(body, callback);
        });
    }

}