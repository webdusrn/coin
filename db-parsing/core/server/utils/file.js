var META = require('../../../bridge/metadata/index');

module.exports = {
    setRemoveFiles: function (req, files, parentFolder, enumPrefixes, attach) {
        var _this = this;
        if (!req) {
            return null;
        }
        if (!attach) {
            _this.refreshFiles(req);
        }
        if (files && files instanceof Array && parentFolder && typeof parentFolder == 'string') {
            for (var i=0; i<files.length; i++) {
                if (files[i] instanceof Object) {
                    req.files.push({
                        path: parentFolder + '/' + files[i].folder + '/' + files[i].dateFolder + '/' + files[i].name
                    });
                    if (enumPrefixes && enumPrefixes instanceof Array && enumPrefixes.length > 0) {
                        for (var j=0; j<enumPrefixes.length; j++) {
                            req.files.push({
                                path: parentFolder + '/' + files[i].folder + '/' + files[i].dateFolder + '/' + enumPrefixes[j] + files[i].name
                            });
                        }
                    }
                } else {
                    _this.refreshFiles(req);
                    break;
                }
            }
        } else {
            _this.refreshFiles(req);
        }
    },
    refreshFiles: function (req) {
        req.files = [];
    }
};