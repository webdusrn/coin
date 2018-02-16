export default function parseDate() {
    "ngInject";

    return function (input) {
        if (input) {
            var date = new Date(input);
            var mm = date.getMonth() + 1;
            var dd = date.getDate();

            return [date.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
            ].join('-');
        } else {
            return '';
        }
    };
}