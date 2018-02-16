
var META = require('../../../metadata/');

module.exports = {
    getUserData: function() {
        var USER = META.std.user;
        var data = {
            secret: 'qqqqqq',
            nick: 'hwarang32' + (Math.random() *10000) % 10,
            gender: USER.genderMale,
            birth: "1987-07-10",
            ip: "192.168.11.101",
            deviceToken: "1231222xc3",
            deviceType: USER.deviceTypeIOS,
            country: "KR",
            language: "ko"
        };

        return data;
    },
    getEmailUser: function () {
        var userFields = this.getUserData();
        userFields.uid = "ggozillacj" +  (Math.random() *10000) % 10+ "@naver.com";
        userFields.type = META.std.user.signUpTypeEmail;
        return userFields;
    },
    getPhoneUser: function () {
        var userFields = this.getUserData();
        return userFields;
    },
    getSocialUser: function () {
        var userFields = this.getUserData();
        return userFields;
    }
};