routing.$inject = ['$urlRouterProvider', '$locationProvider'];

export default function routing($urlRouterProvider, $locationProvider) {
    "ngInject";

    $locationProvider.html5Mode(true).hashPrefix('!');
    // staticLoaderProvider.setRootPath("pages/sample/assets/contents/");
    // var mix = metaManagerProvider.getMixed();
    // for (var k in mix) {
    //     $translateProvider.translations(k, mix[k]);
    // }
    // $translateProvider.preferredLanguage('en');
}