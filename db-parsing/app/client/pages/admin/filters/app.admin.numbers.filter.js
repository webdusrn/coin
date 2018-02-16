export default function numbers() {
    "ngInject";

    return function (numbers) {

        var result = '';

        if (numbers !== undefined && numbers !== null) {
            if (typeof numbers == 'string') {
                result = numbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            } else {
                result = numbers.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            }
        }

        return result;
    };
}