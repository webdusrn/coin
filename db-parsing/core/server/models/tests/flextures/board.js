
var META = require('../../../metadata/');

module.exports = {
    getBoard: function() {
        var obj = {
            'slug': 'testSlug',
            'skin': 'default',
            'roleRead': META.std.user.roleUser,
            'roleWrite': META.std.user.roleUser,
            'isVisible': true,
            'isAnnoy': true,
            'categories': ['cat1','cat2']
        };
        return obj;
    }
};