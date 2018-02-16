export default function multiByteHandler () {
    "ngInject";

    this.forceBind = forceBind;

    function forceBind () {
        var $input = $('<input id="sgc-multi-byte" type="text" style="position: absolute; width: 1px; height: 1px; margin-left: -3000px;">');
        $('body').append($input);
        $input.focus();
        $input.blur();
        $input.remove();
    }
}