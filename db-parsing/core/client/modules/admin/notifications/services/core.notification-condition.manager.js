export default function massNotificationConditionManager(metaManager, MassNotificationCondition, fileUploader) {
    "ngInject";

    var COMMON = metaManager.std.common;

    this.sendNotificationCondition = sendNotificationCondition;

    // function sendNotificationCondition(body, callback) {
    //
    //     if (isFormValidate(body)) {
    //         var massNotificationCondition = new MassNotificationCondition(body);
    //         massNotificationCondition.$save(function (data) {
    //             callback(201, data);
    //         }, function (data) {
    //             callback(data.status, data.data);
    //         });
    //     } else {
    //         callback(400, {
    //             code: "400_53"
    //         });
    //     }
    //
    // }

    function sendNotificationCondition(body, files, callback) {

        if (isFormValidate(body)) {
            // var massNotificationCondition = new MassNotificationCondition(body);
            // massNotificationCondition.$save(function (data) {
            //     callback(201, data);
            // }, function (data) {
            //     callback(data.status, data.data);
            // });

            fileUploader.upload('file', body, files, '/api/admin/mass-notification-condition').then(function(data) {
                callback(201, data.data);
            }).catch(function(err) {
                callback(err.status, err.data)
            });

        } else {
            callback(400, {
                code: "400_53"
            });
        }

    }

    function isFormValidate(form) {

        var isValidate = true;

        if(form.gender == COMMON.all){
            delete form.gender;
        }

        if(form.platform == COMMON.all){
            delete form.platform;
        }

        if(form.minBirthYear == COMMON.all){
            delete form.minBirthYear;
        }

        if(form.maxBirthYear == COMMON.all){
            delete form.maxBirthYear;
        }

        return isValidate;
    }
}