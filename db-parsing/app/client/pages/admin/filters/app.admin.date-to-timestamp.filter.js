export default function dateToTimestamp () {
    "ngInject";

    return function (data) {
        if (data) {
            return new Date(data).getTime();
        } else {
            return null;
        }
    }
}