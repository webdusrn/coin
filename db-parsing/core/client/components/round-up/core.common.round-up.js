export default function roundUp() {
    "ngInject";

    return function (input) {

        function isFloat(n) {
            return Number(n) === n;
        }

        var result = 0;

        if (input) {
            input = parseFloat(input);
            if (isFloat(input)) {
                result = Math.round(input);
            }
        }

        return result;

    };
}