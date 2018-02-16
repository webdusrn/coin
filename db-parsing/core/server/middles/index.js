module.exports.connect = function (config) {
    return function (req, res, next) {
        var middles = {
            s3: require('./s3')(config.aws),
            session: require('./session')(),
            upload: require('./upload')(config),
            notification: require('./notification')(),
            validator: require('./validator')(),
            role: require('./role')(),
            terms: require('./terms')(),
            pay: require('./pay'),
            pgPurchase: require('./pg-purchase')()
        };
        req.middles = middles;
        next();
    };
};