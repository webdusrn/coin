routing.$inject = ['$locationProvider', '$sceProvider', '$httpProvider', '$translateProvider', 'metaManagerProvider'];

export default function routing($locationProvider, $sceProvider, $httpProvider, $translateProvider, metaManagerProvider) {
    $locationProvider.html5Mode(true);
    $sceProvider.enabled(true);
    var mix = metaManagerProvider.getMixed();
    for (var k in mix) {
        $translateProvider.translations(k, mix[k]);
    }
    $translateProvider.preferredLanguage('ko');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $httpProvider.defaults.headers["delete"] = {'Content-Type': 'application/json;charset=utf-8'};
}