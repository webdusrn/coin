export default function oauthManager() {
    "ngInject";

    var oauth = window.oauth;
    return {
        $get: function () {
            return oauth;
        }
    };
}