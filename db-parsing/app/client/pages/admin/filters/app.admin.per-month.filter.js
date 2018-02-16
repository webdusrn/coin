export default function perMonth () {
    'ngInject';

    return function (month) {
        if (month[0] == '0') {
            return month[1] + '월';
        } else {
            return month + '월';
        }
    }
}