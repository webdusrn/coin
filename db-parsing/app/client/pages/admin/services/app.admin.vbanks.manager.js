export default function vbanksManager (Vbank, VbankAmount) {
    'ngInject';

    this.findVbanks = findVbanks;
    this.findAmounts = findAmounts;

    function findVbanks (query, callback) {
        Vbank.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findAmounts (callback) {
        VbankAmount.get({}, {}, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}