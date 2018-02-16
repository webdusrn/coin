export default function microTimeTo12hoursTime($filter) {
    "ngInject";

    return function (input) {

        function calc(microtime) {
            var date = new Date(microtime / 1000);

            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? $filter('translate')('PM') : $filter('translate')('AM');
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = ampm + ' ' + hours + ':' + minutes;

            return strTime;
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