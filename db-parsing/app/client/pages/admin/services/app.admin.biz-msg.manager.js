export default function bizMsgManager (BizMsg) {
    'ngInject';

    this.send = send;

    function send (data, callback) {
        var body = {};
        if (data.key !== undefined) body.key = data.key;
        if (data.phoneNum !== undefined) body.phoneNum = data.phoneNum;
        if (data.payload !== undefined) body.payload = data.payload;
        var bizMsg = new BizMsg(body);
        bizMsg.$save(function () {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}