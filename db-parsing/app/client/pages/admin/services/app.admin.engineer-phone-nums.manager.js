export default function engineerPhoneNumsManager (EngineerPhoneNum) {
    'ngInject';

    this.findEngineerPhoneNums = findEngineerPhoneNums;

    function findEngineerPhoneNums (query, callback) {
        EngineerPhoneNum.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}