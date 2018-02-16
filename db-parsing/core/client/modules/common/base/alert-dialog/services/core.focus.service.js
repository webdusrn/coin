focus.$inject = ['$timeout', '$window'];

export default function focus($timeout, $window) {
    "ngInject";

    return function(id) {
        $timeout(function() {
            var element = $window.document.getElementById(id);
            if(element)
                element.focus();
        });
    };
}