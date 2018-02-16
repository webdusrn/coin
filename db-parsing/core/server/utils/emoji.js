var emojiStrip = require('emoji-strip');

function middleWare () {
    return function (req, res, next) {
        for (var k in req.body) {
            if (typeof req.body[k] == "string") {
                req.body[k] = emojiStrip(req.body[k]);
            }
        }
        next();
    };
}

module.exports = middleWare;
