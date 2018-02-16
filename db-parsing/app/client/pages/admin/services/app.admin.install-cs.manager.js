export default function installCsManager (InstallCs, CsMemo, EstimationSuccess) {
    'ngInject';

    this.findInstallCss = findInstallCss;
    this.findInstallCsById = findInstallCsById;
    this.createCsMemo = createCsMemo;
    this.findCsMemos = findCsMemos;
    this.deleteCsMemo = deleteCsMemo;
    this.setEstimationSuccess = setEstimationSuccess;
    this.deleteRequestInstall = deleteRequestInstall;
    this.complete = complete;

    function complete (id, callback) {
        var installCs = new InstallCs({id: id});
        installCs.$remove(function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteRequestInstall (id, callback) {
        InstallCs.update({id: id}, {}, function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function setEstimationSuccess (estimationId, callback) {
        EstimationSuccess.update({id: estimationId}, {}, function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        })
    }

    function findInstallCss (query, callback) {
        InstallCs.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findInstallCsById (id, callback) {
        InstallCs.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createCsMemo (body, callback) {
        var csMemo = new CsMemo(body);
        csMemo.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findCsMemos (query, callback) {
        CsMemo.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteCsMemo (csMemo, callback) {
        csMemo = new CsMemo(csMemo);
        csMemo.$remove(function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}