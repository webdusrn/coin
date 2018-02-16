var skins = {};

skins.loadSkinNames = function (callback) {
    var fs = require('fs');

    var appBbsSkinPath = __dirname + "/../../../../../app/client/modules/bbs/skins";
    var coreBbsSkinPath = __dirname + "/../../../../../core/client/modules/bbs/skins";

    function removeDuplication(app, core) {
        if (app) {

            //중복된 스킨명을 비교해서 제거
            var skins = unique(core.concat(app));
            return skins;
        } else {
            return core;
        }
    }

    function loadCoreSkinNames(appFiles, callback) {
        fs.readdir(coreBbsSkinPath, function(err, coreFiles) {
            if (err) {
                callback(400);
            } else {
                callback(200, removeDuplication(appFiles, coreFiles))
            }
        });
    }

    fs.exists(appBbsSkinPath, function(result) {
        if (result) {
            fs.readdir(appBbsSkinPath, function(err, appFiles) {
                if (err) {
                    callback(400);
                } else {
                    loadCoreSkinNames(appFiles, callback);
                }
            });
        } else {
            loadCoreSkinNames(null, callback);
        }
    });
};

var unique = function(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x] === newArr[y]) {
                found = true;
                break;
            }
        }
        if (!found) {
            newArr.push(origArr[x]);
        }
    }
    return newArr;
}

module.exports = skins;

