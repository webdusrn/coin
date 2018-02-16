export default function engineerManager (Engineer, User, EngineerInfo, EngineerImage) {
    "ngInject";

    this.findEngineer = findEngineer;
    this.getEngineerInfo = getEngineerInfo;
    this.putEngineer = putEngineer;
    this.removeEngineerImage = removeEngineerImage;

    function findEngineer (body, callback) {
        Engineer.get(body, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function getEngineerInfo (body, callback) {
        EngineerInfo.get(body, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function putEngineer (id, body, callback) {
        Engineer.update({id: id}, body, function (data) {
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function removeEngineerImage (id, body, callback){
        EngineerImage.update({id:id}, body, function (data){
            callback(204, data);
        }, function(data){
            callback(data.status, data.data);
        });
    }
}