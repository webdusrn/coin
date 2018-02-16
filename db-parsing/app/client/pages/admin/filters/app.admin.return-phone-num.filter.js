export default function returnPhoneNum () {
    "ngInject";

    return function (phoneNum) {

        if (phoneNum) {
            var temp = phoneNum + '';
            var changeExp = /[\r\n\s!@#$&%^*()\-=+\\\|\[\]{};:\'`"~,.<>\/?]/g;
            var phoneNum1 = new RegExp("^1[016789]{1}[0-9]{7,8}$");
            var phoneNum2 = new RegExp("^821[016789]{1}[0-9]{7,8}$");
            var phoneNum3 = new RegExp("^8201[016789]{1}[0-9]{7,8}$");
            var correctPhoneNum = new RegExp("^01[016789]{1}[0-9]{7,8}$");
            temp = temp.replace(changeExp, '');

            if (phoneNum1.test(temp)) {
                temp = '0' + temp;
            }

            if (phoneNum2.test(temp)) {
                temp = '0' + temp.slice(2, temp.length);
            }

            if (phoneNum3.test(temp)) {
                temp = temp.slice(2, temp.length);
            }

            if (correctPhoneNum.test(temp)) {
                temp = temp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                return temp;
            } else {
                return 'phoneNone';
            }
        } else {
            return 'phoneNone';
        }
    }
}