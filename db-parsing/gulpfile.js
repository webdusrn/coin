var extend = require('extend');
var path = require('path');
var replace = require('gulp-replace');

var gulp = require('gulp');
const webpack = require('gulp-webpack');
const rename = require("gulp-rename");
const clean = require('gulp-clean');
const injectString = require('gulp-inject-string');
const inject = require('gulp-inject');
const htmlmin = require('gulp-html-minifier');
const gulpIf = require('gulp-if');
var args = require('get-gulp-args')();
// const mocha = require('gulp-mocha');
const mocha = require('gulp-spawn-mocha');
var gulpsync = require('gulp-sync')(gulp);

var appPackage = require('./app/package.json');
var corePackage = require('./package.json');

var fs = require('fs');
var micro = require('microtime-nodejs');
var now = micro.now();

var ngTemplate = require('gulp-ng-template');
var templatePath = require('./core/server/metadata/standards/common').templatePath;

/**
 *
 */
var combinedModuleArray = [];
var combinedThemeObj = {};

var coreModuleArray = fs.readdirSync('core/client/modules/admin/');
var isAppModuleExists = fs.existsSync('app/client/modules/admin/');

if (isAppModuleExists) {
    var appModuleArray = fs.readdirSync('app/client/modules/admin/');
}

var coreThemes = fs.readdirSync('core/client/assets/themes/admin/' + appPackage.themeName + '/stylesheets/modules/');
var isAppThemesExists = fs.existsSync('app/client/assets/themes/admin/' + appPackage.themeName + '/stylesheets/modules/');

if (isAppThemesExists) {
    var appThemes = fs.readdirSync('app/client/assets/themes/admin/' + appPackage.themeName + '/stylesheets/modules/');
}


if (!args.ejs) {
    args.ejs = "./core/server/views/sample.ejs";
}

if (!args.env) {
    args.env = process.env.NODE_ENV = "development";
} else {
    process.env.NODE_ENV = args.env;
}

var ngTemplateIgnoreStat, ngTemplateIgnore;
ngTemplateIgnoreStat = fs.existsSync('./' + getRootType() + '/.ngtemplateignore');
if (ngTemplateIgnoreStat) {
    ngTemplateIgnore = JSON.parse(fs.readFileSync('./' +  getRootType() + '/.ngtemplateignore'));
}

function returnNgTemplatePath (page) {
    if (args.env == "development") {
        return '';
    } else {
        var returnPath = "./" + getRootType() + "/client/pages/" + page + "/**/*.html";
        if (ngTemplateIgnoreStat) {
            var returnPathArray = [returnPath];
            if (ngTemplateIgnore.pages && ngTemplateIgnore.pages.indexOf(page) != -1) {
                return '';
            }
            if (ngTemplateIgnore.paths && ngTemplateIgnore.paths instanceof Object && !(ngTemplateIgnore.paths instanceof Array)) {
                if (ngTemplateIgnore.paths[page] && ngTemplateIgnore.paths[page].length) {
                    ngTemplateIgnore.paths[page].forEach(function (path) {
                        if (path) {
                            returnPathArray.push('!' + './' + getRootType() + path);
                        }
                    });
                }
            }
            if (returnPathArray.length > 1) {
                return returnPathArray;
            } else {
                return returnPathArray[0];
            }
        } else {
            return returnPath;
        }
    }
}

function getJsName() {
    var url = args.ejs;
    var pathArr = url.split("/");
    var jsName = pathArr[4].split(".")[0];
    return jsName;
}

function getRootType() {
    // var url = args.ejs;
    // return url.indexOf("core/") != -1 ? "core" : "app";

    return 'app';
}

function replaceCoreImportPath(moduleName, themeName) {
    return "import '../../../../../core/client/assets/themes/admin/" + themeName + "/stylesheets/modules/" + moduleName + "/core." + moduleName + ".scss'";
}

function replaceAppImportPath(moduleName, themeName) {
    if (combinedThemeObj[moduleName].root == 'app') {
        return "import '../../../../../app/client/assets/themes/admin/" + themeName + "/stylesheets/modules/" + moduleName + "/app." + moduleName + ".scss'";
    } else {
        return '';
    }
}

function combineModules() {

    var combinedModuleObj = {};

    coreModuleArray.forEach(function (coreItem) {
        combinedModuleObj[coreItem] = {
            root: 'core',
            name: coreItem
        };
    });

    if (isAppModuleExists) {
        appModuleArray.forEach(function (appItem) {
            if (combinedModuleObj[appItem]) {
                combinedModuleObj[appItem].root = "app";
            } else {
                combinedModuleObj[appItem] = {
                    root: 'app',
                    name: appItem
                };
            }
        });
    }

    combinedModuleArray = Object.keys(combinedModuleObj).map(key => combinedModuleObj[key]);
}

function combineThemes() {

    coreThemes.forEach(function (coreItem) {
        combinedThemeObj[coreItem] = {
            root: 'core',
            name: coreItem
        };
    });

    if (isAppThemesExists) {
        appThemes.forEach(function (appItem) {
            if (combinedThemeObj[appItem]) {
                combinedThemeObj[appItem].root = "app";
            } else {
                combinedThemeObj[appItem] = {
                    root: 'app',
                    name: appItem
                };
            }
        });
    }
}

function callReplaceThemeGulp(i) {

    var moduleNamePrefix = "replace-theme-";
    var middlePath = '/client/modules/admin/';
    var adminModulePath = middlePath + combinedModuleArray[i].name;

    var moduleName = moduleNamePrefix + combinedModuleArray[i].name;

    if (i == 0) {
        gulp.task(moduleName, () => {
            return gulp.src(combinedModuleArray[i].root + adminModulePath + "/" + combinedModuleArray[i].root + "." + combinedModuleArray[i].name + '.module-build.js')
                .pipe(replace(/#{importCoreTheme}/g, replaceCoreImportPath(combinedModuleArray[i].name, appPackage.themeName)))
                .pipe(replace(/#{importAppTheme}/g, replaceAppImportPath(combinedModuleArray[i].name, appPackage.themeName)))
                .pipe(rename(combinedModuleArray[i].root + "." + combinedModuleArray[i].name + '.module.js'))
                .pipe(gulp.dest(combinedModuleArray[i].root + middlePath + combinedModuleArray[i].name));
        });
    } else {
        gulp.task(moduleName, [moduleNamePrefix + combinedModuleArray[i - 1].name], () => {
            return gulp.src(combinedModuleArray[i].root + adminModulePath + "/" + combinedModuleArray[i].root + "." + combinedModuleArray[i].name + '.module-build.js')
                .pipe(replace(/#{importCoreTheme}/g, replaceCoreImportPath(combinedModuleArray[i].name, appPackage.themeName)))
                .pipe(replace(/#{importAppTheme}/g, replaceAppImportPath(combinedModuleArray[i].name, appPackage.themeName)))
                .pipe(rename(combinedModuleArray[i].root + "." + combinedModuleArray[i].name + '.module.js'))
                .pipe(gulp.dest(combinedModuleArray[i].root + middlePath + combinedModuleArray[i].name));
        });
    }
}

combineModules();
combineThemes();

for (var i = 0; i < combinedModuleArray.length; i++) {
    callReplaceThemeGulp(i);
}

var pagesPath = path.resolve(__dirname, "./app/client/pages");
var pages = fs.readdirSync(pagesPath);
if (pages.indexOf(".DS_Store") != -1) {
    pages.splice(pages.indexOf(".DS_Store"), 1);
}

gulp.task('webpack', ["replace-theme-" + combinedModuleArray[combinedModuleArray.length - 1].name], () => {
    return gulp.src('')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist'));
});

function callPagesBuild(page, afterInjection, url) {
    var injectionArray = [
        './dist/sg-' + page + '-core.js', './dist/sg-' + page + '.js',
        './dist/sg-' + page + '-core.css', './dist/sg-' + page + '.css'
    ];
    var ngTemplateCheck = fs.readFileSync(path.join(__dirname, "./" + getRootType() + "/client/pages/" + page + "/app." + page + ".js"), 'utf8');
    var regAngular = new RegExp("angular", "gi");
    if (regAngular.test(ngTemplateCheck)) {
        injectionArray.unshift('./dist/sg-' + page + '-template.js');
    }

    gulp.task('template-' + page, [afterInjection], () => {
        return gulp.src(returnNgTemplatePath(page))
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(ngTemplate({
                moduleName: 'app.' + page + '.template',
                standalone: true,
                filePath: 'sg-' + page + '-template.js',
                prefix: templatePath + page + '/'
            }))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('injection-' + page, ['template-' + page], () => {
        var src = gulp.src(url);
        var source = gulp.src(injectionArray, {read: false});

        return src.pipe(inject(source))
            .pipe(injectString.replace('sg-' + page + '-core.js', '/sg-' + page + '-core.js?v=' + now))
            .pipe(injectString.replace('sg-' + page + '-core.css', '/sg-' + page + '-core.css?v=' + now))
            .pipe(injectString.replace('\"/dist/', "\""))
            .pipe(injectString.replace('sg-' + page + '.js', "/sg-" + page + ".js?v=" + now))
            .pipe(injectString.replace('sg-' + page + '.css', "/sg-" + page + ".css?v=" + now))
            .pipe(injectString.replace('sg-' + page + '-template.js', "/sg-" + page + "-template.js?v=" + now))
            .pipe(gulp.dest('./' + getRootType() + '/server/views/dist'));
    });

    gulp.task('rename-' + page, ['injection-' + page], () => {
        return gulp.src("./" + getRootType() + "/server/views/dist/" + page + ".ejs")
            .pipe(rename("./" + page + "-" + args.env + ".ejs"))
            .pipe(gulp.dest("./" + getRootType() + "/server/views"));
    });

    gulp.task('clean-' + page, ["rename-" + page], () => {
        return gulp.src("./" + getRootType() + "/server/views/dist/" + page + ".ejs")
            .pipe(clean({force: true}));
    });

    gulp.task('minify-' + page, ["clean-" + page], () => {
        // console.log('args', args);
        return gulp.src("./" + getRootType() + "/server/views/" + page + "-" + args.env + ".ejs")
            .pipe(gulpIf(args.env == 'production', htmlmin({collapseWhitespace: true})))
            .pipe(gulp.dest('./' + getRootType() + '/server/views'));
    });
}

for (var i = 0; i < pages.length; ++i) {

    var page = pages[i];
    var afterInjection;

    var url = './app/server/views/' + page + '.ejs';

    if (i == 0) {
        afterInjection = 'webpack';
    } else {
        afterInjection = 'minify-' + pages[i - 1];
    }

    callPagesBuild(page, afterInjection, url);
}

gulp.task('webpack-watch', ['minify-' + pages[pages.length - 1]], () => {
    var webpackconfig = require('./webpack.config.js');
    if (args.env == 'development') {
        webpackconfig.watch = true;
    }
    return gulp.src('')
        .pipe(gulpIf(args.env == 'development', webpack(webpackconfig)))
        .pipe(gulp.dest('dist'));
});


gulp.task('test-mocha', (cb) => {
    process.env.NODE_ENV = "test";
    gulp.src('*/server/apis/*.spec.js', {read: false})
        .pipe(mocha({
            reporter: 'nyan',
            env: {'NODE_ENV': 'test'}
        }))
        .pipe(gulp.dest('dist'))
        .on('end', cb);
});

gulp.task('build', ['webpack-watch']);
gulp.task('test', ['test-mocha']);