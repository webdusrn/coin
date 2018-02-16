export default function attachZero () {
    "ngInject";

    return function (data) {
        if (data) {
            if (typeof data == "string") {
                data = parseInt(data);
            }
            if (typeof data != 'number') {
                return null;
            }
            if (data < 10) {
                return '0' + data;
            } else {
                return data;
            }
        } else {
            return null;
        }
    };
}