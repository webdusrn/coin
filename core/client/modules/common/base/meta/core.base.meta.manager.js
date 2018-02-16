export default function metaManager() {
    "ngInject";

    var meta = window.meta;
    var mix = JSON.parse(JSON.stringify(meta.langs));
    var codes = meta.codes;

    for (var k in codes) {
        if (!mix[k]) mix[k] = {};
        for (var kk in codes[k]) {
            mix[k][kk] = codes[k][kk];
        }
    }

    meta.mix = mix;

    return {
        // for provider.
        getMixed: function() {
            return mix;
        },
        get: function() {
            return meta;
        },
        // for service object.
        $get: function () {
            return meta;
        }
    }
}