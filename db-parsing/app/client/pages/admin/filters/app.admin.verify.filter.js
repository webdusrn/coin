export default function verify() {
    "ngInject";

    return function (text) {

        if(text == 'roleC'){
            return "unauthorized"
        }
        else{
            return "authorized"
        }
    };
}