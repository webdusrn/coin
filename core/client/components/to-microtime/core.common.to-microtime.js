export default function toMicrotime() {
    "ngInject";

    return function (time) {
        var microtime;
        if (time instanceof Date) {
            microtime = Number(time.getTime() + '000');
        } else if (time instanceof Number) {
            microtime = Number(time + '000');
        } else if (typeof time == 'string') {
            microtime = new Date(time);
            if (!microtime) {
                return "Error Time";
            }

            var temp = microtime.getTime() + microtime.getTimezoneOffset() * 60 * 1000;
            microtime = Number(temp + '000');
        } else {
            microtime = "Error Time";
        }
        return microtime;
    };
}