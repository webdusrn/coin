var fs = require("fs"), path = require("path");
var packageJson = require('../../package.json');
var appRoot = require('app-root-path');
var express = require('express');
var META = require('../../bridge/metadata');
var CONFIG = require('../../bridge/config/env');

function getApiDirectorys(category, isCore) {

    var retDirs = [];
    var p = path.resolve(__dirname, "../server/apis/" + category);
    if (!isCore) {
        p = path.resolve(__dirname, "../../app/server/apis/" + category);
    }

    var files = fs.readdirSync(p);

    files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isDirectory();
    }).forEach(function (file) {
        var splited = file.split("/");
        var dirName = splited[splited.length - 1];
        retDirs.push(dirName);
    });

    return retDirs;
}

function getApiCategories(isCore) {

    var retDirs = [];
    var p = path.resolve(__dirname, "../server/apis");
    if (!isCore) {
        p = path.resolve(__dirname, "../../app/server/apis");
    }

    if (fs.existsSync(path.resolve(p))) {
        var files = fs.readdirSync(p);

        files.map(function (file) {
            return path.join(p, file);
        }).filter(function (file) {
            return fs.statSync(file).isDirectory();
        }).forEach(function (file) {
            var splited = file.split("/");
            var dirName = splited[splited.length - 1];
            retDirs.push(dirName);
        });
    }

    return retDirs;
}

var getCategoryList = function (app, apiName, isCore) {

    var defaultResourceName = '';
    var defaultCategoryName = '';
    var categories = getApiCategories(isCore);
    var catList = [];

    // categories
    categories.forEach(function (category) {

        if (!defaultCategoryName) {
            defaultCategoryName = category;
        }

        var apiList = [];
        var dirs = getApiDirectorys(category, isCore);
        var isOnlyParams = true;
        var resourceNames = [];

        // resources
        for (var i = 0; i < dirs.length; ++i) {
            var resource = dirs[i].split('/');
            resource = resource[resource.length - 1];

            if (!defaultResourceName) {
                defaultResourceName = resource;
            }

            var apiPath = path.resolve(appRoot + "/core/server/apis/" + category + "/" + dirs[i] + "/" + resource + ".assembly");
            if (!isCore) {
                apiPath = path.resolve(appRoot + "/app/server/apis/" + category + "/" + dirs[i] + "/" + resource + ".assembly");
            }
            // api routing.

            var assembly = require(apiPath);
            app.use('/' + apiName + '/' + category, assembly.router);

            // api templete routing.
            var api = assembly.api;
            resourceNames.push(resource);

            var resourceObj = {
                resource: resource,
                methods: {}
            };

            // methods
            for (var k in api) {
                var params = api[k](isOnlyParams)();
                resourceObj.methods[k] = params;
            }

            apiList.push(resourceObj);
        }

        catList.push({
            name: category,
            apiList: apiList
        });
    });

    return {
        defaultCategoryName: defaultCategoryName,
        defaultResourceName: defaultResourceName,
        catList: catList
    };
};

var mixApi = function (app, core) {
    var appList = app.catList;
    var coreList = core.catList;

    for (var i = 0; i < coreList.length; ++i) {
        var catName = coreList[i].name;
        var isSearched = false;

        // 카테고리가 있는지 조회한다.
        for (var j = 0; j < appList.length; ++j) {

            // 해당 카테고리가 있으면 리소스들을 검사하고 core에는 있고 app에는 없는 것을 app에 끼워넣는다.
            if (catName == appList[j].name) {
                isSearched = true;
                var coreApiList = coreList[i].apiList;
                var appApiList = appList[j].apiList;

                // apiList를 조회한다.
                for (var k = 0; k < coreApiList.length; ++k) {
                    var isResourceSearched = false;

                    for (var kk = 0; kk < appApiList.length; ++kk) {
                        if (appApiList[kk].resource == coreApiList[k].resource) {
                            isResourceSearched = true;
                        }
                    }

                    if (!isResourceSearched) {
                        // 리소스가 없으면 app에 core리소스를 끼워 넣는다.
                        appApiList.push(coreApiList[k]);
                    }
                }
            }
        }

        // 해당 카테고리가 없으면 끼워넣는다.
        if (!isSearched) {
            appList.push(coreList[i]);
        }
    }

    return app;
};

function refineResourceMethods(catList) {
    return function (req, res, next) {
        var catList2 = JSON.parse(JSON.stringify(catList));
        for (var i = 0; i < catList2.length; ++i) {
            var apiList = catList2[i].apiList;
            var removeIndexes = [];
            for (var j = 0; j < apiList.length; ++j) {
                var api = apiList[j];
                var methods = api.methods;
                for (var key in methods) {
                    var method = methods[key];
                    // role이 있고 로그인이 안되어 있거나
                    if ((!req.user && method.role && method.role > META.std.user.roleUser) || (req.user && (method.role && method.role > req.user.role))) {
                        delete methods[key];
                    }
                }
                var bSearched = false;
                for (var key in methods) {
                    bSearched = true;
                    break;
                }
                if (!bSearched) {
                    removeIndexes.push(j);
                }
            }

            for (var k = removeIndexes.length-1; k >= 0 ; --k) {
                apiList.splice(removeIndexes[k], 1);
            }
        }
        req.catList = catList2;
        next();
    };
}

module.exports = function (app, apiName) {

    var coreObj = getCategoryList(app, apiName, true);
    var appObj = getCategoryList(app, apiName, false);

    if(CONFIG.flag && CONFIG.flag.isNotUseCoreApi){
        coreObj.catList = [];
    }

    var finalObj = mixApi(appObj, coreObj);

    var defaultCategoryName = finalObj.defaultCategoryName || coreObj.defaultCategoryName;
    var defaultResourceName = finalObj.defaultResourceName || coreObj.defaultResourceName;
    var catList = finalObj.catList;

    // first templete page.
    var apiFirstTempleteRouter = express.Router();
    app.use(apiFirstTempleteRouter);

    apiFirstTempleteRouter.get('/' + apiName + '/tester', function (req, res) {
        res.redirect('/' + apiName + '/tester/' + defaultCategoryName + "/" + defaultResourceName);
    });


    // all category
    catList.forEach(function (catObj) {
        catObj.apiList.forEach(function (resourceObj) {
            var resourceName = resourceObj.resource;
            var apiTempleteRouter = express.Router();
            apiTempleteRouter.get('/' + apiName + '/tester/' + catObj.name + "/" + resourceName,
                refineResourceMethods(catList),
                function (req, res) {
                    res.render('api-tester', {
                        prefix: apiName,
                        catList: req.catList,
                        currentCategory: catObj.name,
                        currentResource: resourceName,
                        version: packageJson.version,
                        meta: req.meta
                    });
                });
            app.use(apiTempleteRouter);
        });
    });
};