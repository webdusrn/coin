export default function nullToNo() {
    "ngInject";

    return function (string) {

        if(string == undefined || string == null || string == 0 || string == ''){
            return 'N';
        }

        return 'Y';
    };
}