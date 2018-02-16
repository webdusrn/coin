module.exports = function () {
    function Mobile () {

    }

    Mobile.prototype.checkVersion = function () {
        return function (req, res, next) {
            if (req.config.flag.checkMobileVersion) {
                var API = req.meta.std.api;
                var device = req.headers[API.deviceKey];
                var version = req.headers[API.versionKey];
                if (device && version) {
                    var versions = version.split('.');
                    if (versions.length == 3) {
                        req.models.MobileVersion.getCurrentForceUpdateVersion(device, function (status, data) {
                            if (status == 200) {
                                var majorVersion = parseInt(versions[0]);
                                if (majorVersion > data.majorVersion) {
                                    next();
                                } else if (majorVersion == data.majorVersion) {
                                    var minorVersion = parseInt(versions[1]);
                                    if (minorVersion > data.minorVersion) {
                                        next();
                                    } else if (minorVersion == data.minorVersion) {
                                        if (parseInt(versions[2]) >= data.hotfixVersion) {
                                            next();
                                        } else {
                                            return res.hjson(req, next, 410, {
                                                code: "410_0003"
                                            });
                                        }
                                    } else {
                                        return res.hjson(req, next, 410, {
                                            code: "410_0003"
                                        });
                                    }
                                } else {
                                    return res.hjson(req, next, 410, {
                                        code: "410_0003"
                                    });
                                }
                            } else if (status == 404) {
                                return res.hjson(req, next, 410, {
                                    code: '410_0001'
                                });
                            } else {
                                return res.hjson(req, next, status, data);
                            }
                        });
                    } else {
                        return res.hjson(req, next, 410, {
                            code: "410_0004"
                        });
                    }
                } else {
                    return res.hjson(req, next, 410, {
                        code: '410_0002'
                    });
                }
            } else {
                next();
            }
        }
    };

    return new Mobile();
};