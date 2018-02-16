var fs = require('fs');
var path = require('path');

module.exports = {
    getPages: function () {
        var pages = [];
        var pagesPath = path.join(__dirname, '../../../app/client/pages');

        if (fs.existsSync(pagesPath)) {
            var directories = fs.readdirSync(pagesPath);
            directories.map(function (directory) {
                return path.join(pagesPath, directory);
            }).filter(function (directory) {
                return fs.statSync(directory).isDirectory();
            }).forEach(function (directory) {
                var splited = directory.split('/');
                var directoryName = splited[splited.length - 1].split('.')[0];
                pages.push(directoryName);
            });
        }

        pages.unshift("default");

        return pages;
    }
};