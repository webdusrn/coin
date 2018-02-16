
export default function errSrc() {
    "ngInject";

    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.isHide == true) {
                    element.css('display', 'block');
                }
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
}