export default function optionsManager (metaManager, Option) {
    'ngInject';

    this.findOptions = findOptions;

    function findOptions (data, callback) {
        var query = {};
        if (data.searchField !== undefined) query.searchField = data.searchField;
        if (data.searchItem !== undefined) query.searchItem = data.searchItem;
        if (data.orderBy !== undefined) query.orderBy = data.orderBy;
        if (data.sort !== undefined) query.sort = data.sort;
        if (data.size !== undefined) query.size = data.size;
        if (data.offset !== undefined) query.offset = data.offset;
        if (data.type !== undefined) query.type = data.type;
        if (data.sido !== undefined) query.sido = data.sido;
        if (data.sigungu !== undefined) query.sigungu = data.sigungu;
        Option.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}