export default function noticesManager($filter, Notice, metaManager, dialogHandler) {
    "ngInject";

    var COMMON = metaManager.std.common;

    this.findNoticeById = findNoticeById;
    this.updateNoticeById = updateNoticeById;
    this.findNotices = findNotices;
    this.deleteNotice = deleteNotice;
    this.createNotice = createNotice;

    function updateNoticeById(id, notice, callback) {


        if (isFormValidate(notice)) {
            var where = {id: id};
            Notice.update(where, notice, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        } else {
            callback(400, {
                code: "400_53"
            });
        }

    }

    function findNoticeById(noticeId, callback) {
        Notice.get({
            id: noticeId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findNotices(data, callback) {
        var query = {};
        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.searchField !== undefined) query.searchField = data.searchField;
        if (data.last !== undefined) query.last = data.last;
        if (data.size !== undefined) query.size = data.size;
        if (data.offset !== undefined) query.offset = data.offset;
        if (data.country !== undefined) query.country = data.country;
        if (data.type !== undefined && data.type != COMMON.all) query.type = data.type;
        if (data.sort !== undefined) query.sort = data.sort;
        Notice.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteNotice(notice, callback) {
        notice = new Notice(notice);
        notice.$remove(function (data) {
            callback(204);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function createNotice(body, callback) {

        if (isFormValidate(body)) {
            var notice = new Notice(body);
            notice.$save(function (data) {
                callback(201, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        } else {
            callback(400, {
                code: "400_53"
            });
        }

    }

    function isFormValidate(form) {

        var isValidate = true;

        if (form.title === undefined || form.title === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireTitle'), '', true);
            return isValidate;
        }

        if (form.body === undefined || form.body === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireBody'), '', true);
            return isValidate;
        }
        if (form.type === undefined || form.type === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireType'), '', true);
            return isValidate;
        }
        if (form.country === undefined || form.country === '') {
            isValidate = false;
            dialogHandler.show('', $filter('translate')('requireCountry'), '', true);
            return isValidate;
        }

        return isValidate;
    }

}