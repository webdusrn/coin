export default function trustAsHtml($sce) {
    "ngInject";

    return function (string) {

        var result = '';

        if (typeof string == 'string') {
            result = $sce.trustAsHtml(string);
        }

        return result;
    };
}