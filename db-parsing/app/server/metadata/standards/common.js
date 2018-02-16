var standards = {
    "cdn": {
        "rootUrl": "/"
    },
    "host": {
        "url": ""
    },
    "api": {
        "deviceKey": "sgsg-device",
        "versionKey": "sgsg-version"
    },
    "flag": {
        "isMoreSocialInfo": false, // 소셜가입할때 추가정보가 필요할경우.
        "isResponsive": true
    }
};

if (!this.window && module && module.exports) {
    module.exports = standards;
} else {
    if (!window.meta) window.meta = {};
    window.meta.std = standards;
}