export default function nullToZero() {
    "ngInject";

    return function (int) {

        if(int == undefined || int == null || int == 0 || int == ''){
            return 0;
        }

        return int;
    };
}