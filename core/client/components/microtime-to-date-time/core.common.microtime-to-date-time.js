export default function microTimeToDateTime() {
    "ngInject";

    return function (input) {

        function calc(microtime) {
            var date = new Date(microtime / 1000);

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();

            if (parseInt(month) < 10) {
                month = '0' + month;
            }

            if (parseInt(day) < 10) {
                day = '0' + day;
            }

            if (parseInt(hour) < 10) {
                hour = '0' + hour;
            }

            if (parseInt(min) < 10) {
                min = '0' + min;
            }

            return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
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