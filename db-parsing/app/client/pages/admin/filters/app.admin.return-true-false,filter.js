export default function returnTrueFalse () {
    'ngInject';

    return function (data, trueData, falseData) {
        if (data) {
            if (trueData) {
                return trueData;
            } else {
                return 'O';
            }
        } else {
            if (falseData) {
                return falseData;
            } else {
                return 'X';
            }
        }
    }
}