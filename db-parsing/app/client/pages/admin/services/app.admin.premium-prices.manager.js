export default function premiumPricesManager (PremiumPrice) {
    'ngInject';

    this.findPremiumPrices = findPremiumPrices;
    this.updatePremiumPrice = updatePremiumPrice;

    function findPremiumPrices (query, callback) {
        PremiumPrice.query(query, function (data) {
            callback(200, data);
        }, function () {
            callback(data.status, data.data);
        });
    }

    function updatePremiumPrice (premiumPrice, callback) {
        var where = {id: premiumPrice.id};
        var body = {price: premiumPrice.price};
        PremiumPrice.update(where, body, function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}