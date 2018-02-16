var standardsLocal = {
    "KR": {

    }
};

if (!this.window && module && module.exports) {
    module.exports = standardsLocal;
} else {
    if (!window.meta) window.meta = {};
    window.meta.stdLocal = standardsLocal;
}