export default function microTimeToDate() {
    "ngInject";

    return function (input) {

        function calc(microtime) {
            var date = new Date(microtime / 1000);

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            if (parseInt(month) < 10) {
                month = '0' + month;
            }

            if (parseInt(day) < 10) {
                day = '0' + day;
            }

            return year + '-' + month + '-' + day;
        }

        if (input) {
            if (input === parseInt(input)) {
                return calc(input);
            } else if (typeof input == 'string') {
                input = parseInt(input);
                return calc(input);
            } else {
                return 'Invalid type';
            }

        } else {
            return '';
        }

    };
}