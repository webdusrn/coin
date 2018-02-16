var path = require('path');
var fs = require('fs');

module.exports = {
    // obj1, obj2를 합치는데, obj2가 우선순위가 더 높다.
    mix: function(obj1, obj2) {
        for (var k in obj1) {
            // obj2에 obj1값이 없으면 추가로 끼워야한다.
            if (obj2[k] === null || obj2[k] === undefined || obj2[k] === '') {
                obj2[k] = obj1[k];
            }
            // obj2에 값이 이미 있을경우
            else {
                // 현재 값이 오브젝트라면 재귀를 호출해야한다.
                if (obj1[k] instanceof Object && !(obj1[k] instanceof Array)) {
                    this.mix(obj1[k], obj2[k]);
                }
            }
        }
        return obj2;
    },
    mixFromDir: function(dirname, dir1, dir2) {

        var coreCodes = path.resolve(dirname, dir1);
        var appCodes = path.resolve(dirname, dir2);

        var appFiles = null;
        var coreFiles = fs.readdirSync(coreCodes);
        if (fs.existsSync(appCodes)) {
            appFiles = fs.readdirSync(appCodes);
        }

        var codeObj = {};
        coreFiles.forEach(function (code) {
            if (code != 'index.js') {
                codeObj[code] = code;
            }
        });

        if (appFiles) {
            appFiles.forEach(function (code) {
                if (code != 'index.js') {
                    codeObj[code] = code;
                }
            });
        }

        var retObj = {};
        for (var k in codeObj) {
            var key = codeObj[k].replace(".json", "");
            var obj = this.mixFromPath(dirname, dir1 + "/" + codeObj[k], dir2 + "/" + codeObj[k]);
            if (obj) {
                retObj[key] = obj;
            }
        }

        return retObj;
    },
    mixFromPath: function(dirname, path1, path2) {

        path1 = path.resolve(dirname, path1);
        path2 = path.resolve(dirname, path2);

        var core = null;
        var app = null;

        if (fs.existsSync(path1)) {
            core = require(path1);
        }

        if (fs.existsSync(path2)) {
            app = require(path2);
        }

        if (core && app) {
            return this.mix(core, app);
        } else if (core && !app) {
            return core;
        } else if (!core && app) {
            return app;
        } else {
            return null;
        }
    },
    mixModelFromPath: function(dirname, path1, path2) {
        var path = require('path');
        var fs = require('fs');

        path1 = path.resolve(dirname, path1);
        path2 = path.resolve(dirname, path2);

        var core = require(path1);
        if (fs.existsSync(path2)) {
            var app = require(path2);
            return this.mix(core, app);
        } else {
            return core;
        }
    },
    mixModels: function(obj1, obj2) {
        for (var k in obj1) {
            // obj2에 obj1값이 없으면 추가로 끼워야한다.
            if (!obj2[k]) {
                obj2[k] = obj1[k];
            }
        }
        return obj2;
    }
};