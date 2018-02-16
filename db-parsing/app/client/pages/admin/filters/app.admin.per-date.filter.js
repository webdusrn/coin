export default function perDate ($filter) {
    'ngInject';

    var attachZero = $filter('attachZero');
    return function (date, year, month) {
        var first = Math.floor((new Date(year, month - 1, 1).getTime() + 32400000) / 86400000);
        return year + '-' + attachZero(month) + '-' + attachZero(date - first + 1);
    }
}