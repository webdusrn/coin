export default function returnSignUpCheck ($filter) {
    "ngInject";

    var translate = $filter('translate');

    return function (signUpCheck) {

        if (signUpCheck) {
            return translate('isSignUp');
        } else {
            return translate('isNotSignUp');
        }
    }
}