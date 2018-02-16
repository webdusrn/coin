export default class StaticLoader {
    /*@ngInject*/
    constructor() {
        this.rootPath = "";
        this.cacheMap = {};
    }
    setRootPath(path) {
        this.rootPath = path;
    }
    $get($http) {
        var factory = {};
        var self = this;
        factory.get = function (path, callback) {
            if (rootPath) {
                path = self.rootPath + path;
            }
            if (self.cacheMap[self.cacheMap]) {
                return callback(200, self.cacheMap[self.cacheMap]);
            }
            $http.get(path).then(function (res) {
                if (res.status == 200) {
                    self.cacheMap[path] = res.data;
                }
                callback(res.status, res.data);
            });
        };
        return factory;
    }
}
