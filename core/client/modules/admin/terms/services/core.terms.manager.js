export default function termsManager(Terms, metaManager, loadingHandler, dialogHandler, $filter) {
    "ngInject";


    var LOADING = metaManager.std.loading;
    var MAGIC = metaManager.std.magic;

    this.findTermsById = findTermsById;
    this.updateTermsById = updateTermsById;
    this.findTerms = findTerms;
    this.deleteTerms = deleteTerms;
    this.createTerms = createTerms;

    function updateTermsById(id, terms, callback) {

        if (isFormValidate(terms)) {

            var body = {
                title: terms.title,
                body: terms.body,
                type: terms.type,
                language: terms.language,
                startDate: $filter('toMicrotime')(terms.startDate)
            };

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateTermsById');

            var where = {id: id};
            Terms.update(where, body, function (data) {
                callback(200, data);
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateTermsById');
            }, function (data) {
                callback(data.status, data.data);
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateTermsById');
            });

        } else {
            callback(400, {
                code: "400_53"
            });
        }

    }

    function findTermsById(termsId, callback) {

        loadingHandler.startLoading(LOADING.spinnerKey, 'findTermsById');
        Terms.get({
            id: termsId
        }, function (data) {
            callback(200, data);
            loadingHandler.endLoading(LOADING.spinnerKey, 'findTermsById');
        }, function (data) {
            callback(data.status, data.data);
            loadingHandler.endLoading(LOADING.spinnerKey, 'findTermsById');
        });
    }

    function findTerms(data, callback) {

        loadingHandler.startLoading(LOADING.spinnerKey, 'findTerms');

        var query = {};
        if (data.appliedId !== undefined) query.appliedId = data.appliedId;
        if (data.title !== undefined) query.title = data.title;
        if (data.type !== undefined) query.type = data.type;
        if (data.language !== undefined) query.language = data.language;

        Terms.query(query, function (data) {
            callback(200, data);
            loadingHandler.endLoading(LOADING.spinnerKey, 'findTerms');
        }, function (data) {
            callback(data.status, data.data);
            loadingHandler.endLoading(LOADING.spinnerKey, 'findTerms');
        });
    }

    function deleteTerms(terms, callback) {

        loadingHandler.startLoading(LOADING.spinnerKey, 'deleteTerms');

        terms = new Terms(terms);
        terms.$remove(function (data) {
            callback(204);
            loadingHandler.endLoading(LOADING.spinnerKey, 'deleteTerms');
        }, function (data) {
            callback(data.status, data.data);
            loadingHandler.endLoading(LOADING.spinnerKey, 'deleteTerms');
        });
    }

    function createTerms(terms, callback) {
        if (isFormValidate(terms)) {

            var body = {
                title: terms.title,
                content: terms.content,
                type: terms.type,
                language: terms.language,
                startDate: $filter('toMicrotime')(terms.startDate)
            };

            loadingHandler.startLoading(LOADING.spinnerKey, 'createTerms');
            terms = new Terms(body);
            terms.$save(function (data) {
                callback(201, data);
                loadingHandler.endLoading(LOADING.spinnerKey, 'createTerms');
            }, function (data) {
                callback(data.status, data.data);
                loadingHandler.endLoading(LOADING.spinnerKey, 'createTerms');
            });
        }
    }

    function isFormValidate(terms) {

        if (terms.title === undefined || terms.title === '') {
            dialogHandler.show('', '제목을 입력해 주세요.', '', true);
            return false;
        }

        if (terms.content === undefined || terms.content === '') {
            dialogHandler.show('', '내용을 입력해 주세요.', '', true);
            return false;
        }
        if (terms.type === undefined || terms.type === '') {
            dialogHandler.show('', '타입을 입력해 주세요.', '', true);
            return false;
        }
        if (terms.language === undefined || terms.language === '') {
            dialogHandler.show('', '언어을 입력해 주세요.', '', true);
            return false;
        }
        if (terms.startDate === undefined || terms.startDate === '') {
            dialogHandler.show('', '적용일을 입력해 주세요.', '', true);
            return false;
        }

        return true;
    }

}