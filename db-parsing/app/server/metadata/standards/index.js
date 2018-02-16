var standard = require('./' + process.env.NODE_ENV + '.js');
var commonStandard = require('./common.js');

for (var k in commonStandard) {
    var std = standard[k];
    if (std instanceof String) {
        if (standard[k]) {
            commonStandard[k] = standard[k];
        }
    } else if (std instanceof Object) {
        for (var kk in std) {
            if (std[kk] !== undefined) {
                commonStandard[k][kk] = std[kk];
            }
        }
    } else if (std instanceof Array) {
        for (var i=0; i<std.length; i++) {
            commonStandard[k][i] = std[i];
        }
    }
}

module.exports = commonStandard;