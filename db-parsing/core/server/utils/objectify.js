module.exports = {
    query: {
        select: function (tableName, aliasArray, fieldArray) {
            var query = "";
            if (typeof tableName == "string" && aliasArray instanceof Array && fieldArray instanceof Array) {
                var alias = aliasArray.join('.');
                for (var i = 0; i < fieldArray.length; i++) {
                    if (i) {
                        query += ", ";
                    }
                    query += tableName + "." + fieldArray[i];
                    if (alias) {
                        query += " AS '" + alias + "." + fieldArray[i] + "'";
                    }
                }
                return query;
            } else {
                console.log("generate query select parameter error");
                return query;
            }
        }
    },
    convert: function (data, keyPattern) {

        var result = [];

        var indexes = {
            currentId: null,
            index: null
        };

        this.setIndexes(keyPattern, indexes);

        for (var i = 0; i < data.length; i++) {
            var row = data[i];

            if (row['id']) {
                if (row['id'] != indexes.currentId) {
                    result.push({});
                    indexes.currentId = row['id'];
                    indexes.index = result.length - 1;

                    //부모가 다른경우 인덱스를 초기화해서 자식아이디가 같아도 추가할수 있게한다.
                    this.setIndexes(keyPattern, indexes);
                }
            }

            this.setStructure(row, null, keyPattern, result, indexes);

            for (var k in row) {
                this.objectify(k, row[k], keyPattern, result[indexes.index], indexes);
            }
        }

        return result;

    },
    setIndexes: function (keyPattern, indexes) {

        var refinedKeyPattern = {};

        if (keyPattern instanceof Array) {
            refinedKeyPattern = keyPattern[0];
        } else {
            refinedKeyPattern = keyPattern;
        }


        for (var key in refinedKeyPattern) {

            if (key == 'attributes') {
                var attributes = refinedKeyPattern[key];

                for (var k in attributes) {
                    var attribute = attributes[k];

                    if (attribute.type.__proto__.key == "BOOLEAN") {
                        indexes[k] = true;
                    }
                }

                delete refinedKeyPattern.attributes;

            } else {
                if (indexes[key]) {
                    indexes[key].currentId = null;
                    indexes[key].index = null;
                } else {
                    indexes[key] = {
                        currentId: null,
                        index: null
                    };
                }

                var first = {};

                if (keyPattern[key] instanceof Array) {
                    first = keyPattern[key][0];
                } else {
                    first = keyPattern[key];
                }

                this.setIndexes(refinedKeyPattern[key], indexes[key]);
            }

        }

    },
    setStructure: function (row, previousIdKey, keyPattern, result, indexes, previousTrackingId) {

        var currentTrackingId;

        var refinedKeyPattern;
        var refinedResult;

        if (keyPattern instanceof Array) {
            refinedKeyPattern = keyPattern[0];
        } else {
            refinedKeyPattern = keyPattern;
        }

        if (result instanceof Array) {
            if (result[indexes.index]) {
                refinedResult = result[indexes.index];
            } else {
                refinedResult = {};
            }
        } else {
            refinedResult = result
        }

        for (var key in refinedKeyPattern) {

            var idKey;
            var currentKey;
            var currentResult;

            if (previousIdKey) {
                currentKey = previousIdKey + '.' + key;
                idKey = currentKey + '.id';
            } else {
                currentKey = key;
                idKey = currentKey + '.id'
            }

            if (!refinedResult[key]) {
                if (refinedKeyPattern[key] instanceof Object) {
                    refinedResult[key] = {};
                }
                if (refinedKeyPattern[key] instanceof Array) {
                    refinedResult[key] = [];
                    indexes[key].arrayIds = {};
                }
            }

            if (row[idKey]) {

                if (previousTrackingId === undefined) {
                    currentTrackingId = row[idKey];
                } else {
                    currentTrackingId = previousTrackingId + '.' + row[idKey];
                }

                if (currentTrackingId != indexes[key].trackingId) {

                    if (refinedKeyPattern[key] instanceof Array) {
                        if (indexes[key].arrayIds['k' + row[idKey]] === undefined) {
                            refinedResult[key].push({});
                            indexes[key].index = refinedResult[key].length - 1;
                            indexes[key].currentId = row[idKey];
                            indexes[key].trackingId = currentTrackingId;

                            indexes[key].arrayIds['k' + row[idKey]] = true;
                        }
                    }
                }

                currentResult = refinedResult[key];

                if (refinedKeyPattern[key]) {
                    this.setStructure(row, currentKey, refinedKeyPattern[key], currentResult, indexes[key], currentTrackingId);
                }
            } else {
                //키에 해당하는 밸류가 널이면 인덱스에 null을 줘서 객체를 생성하지 않는다

                if (refinedResult[key] instanceof Array) {
                    refinedResult[key] = [];
                } else {
                    refinedResult[key] = null;
                }

                indexes[key].index = null;
                indexes[key].currentId = null;
            }
        }

    },
    objectify: function (key, value, keyPattern, item, indexes) {

        var temp = key.split('.');

        var currentItem = item;
        var currentIndex = indexes;

        for (var i = 0; i < temp.length; i++) {
            if (i < temp.length - 1) {
                if (keyPattern[temp[i]]) {
                    if (keyPattern[temp[i]] instanceof Array) {

                        if (currentItem[temp[i]] instanceof Array) {

                            if (currentIndex[temp[i]].index != null) {
                                currentItem = currentItem[temp[i]][currentIndex[temp[i]].index];
                            } else {
                                //index가 null이면 데이터가 없는 것이므로 마지막 단계까지 안가고 바로 종료
                                return false;
                            }

                        }

                        currentIndex = currentIndex[temp[i]];
                        keyPattern = keyPattern[temp[i]][0];
                    } else {
                        if (currentItem[temp[i]]) {
                            currentItem = currentItem[temp[i]];
                        } else {
                            return false;
                        }

                        currentIndex = currentIndex[temp[i]];
                        keyPattern = keyPattern[temp[i]];
                    }
                } else {
                    console.log('objectifyError', temp[i]);
                }
            } else {
                if (currentIndex[temp[i]]) {
                    currentItem[temp[i]] = this.sanitizeBoolean(value);
                } else {
                    currentItem[temp[i]] = value;
                }
            }

        }

    },
    sanitizeBoolean: function (value) {

        // if (string && typeof string == 'string') {
        //     if (string == 'true') {
        //         return true;
        //     }
        //
        //     if (string == 'false') {
        //         return false;
        //     }
        // }

        return value ? true : false;
    }

    /**
     * 인덱스
     */
    // for (var key in keyPattern) {
    //     indexes[key] = {
    //         currentId: null,
    //         index: null
    //     };
    //
    //     var first = {};
    //
    //     if (keyPattern[key] instanceof Array) {
    //         first = keyPattern[key][0];
    //     } else {
    //         first = keyPattern[key];
    //     }
    //
    //     for (var key2 in first) {
    //
    //         indexes[key][key2] = {
    //             currentId: null,
    //             index: null
    //         };
    //
    //         var second = {};
    //
    //         if (keyPattern[key][key2] instanceof Array) {
    //             second = keyPattern[key][key2][0];
    //         } else {
    //             second = keyPattern[key][key2];
    //         }
    //
    //         for (var key3 in second) {
    //
    //             if (key3 instanceof Array) {
    //                 key3 = key3[0]
    //             }
    //
    //             indexes[key][key2][key3] = {
    //                 currentId: null,
    //                 index: null
    //             };
    //         }
    //
    //
    //     }
    // }

    /**
     * 스트럭쳐
     */
    // for (key in keyPattern) {
    //     if (!result[indexes.index][key]) {
    //         if (keyPattern[key] instanceof Object) {
    //             result[indexes.index][key] = {};
    //         }
    //         if (keyPattern[key] instanceof Array) {
    //             result[indexes.index][key] = [];
    //         }
    //     }
    //
    //     if (row[key + '.id']) {
    //         if (row[key + '.id'] != indexes[key].currentId) {
    //
    //             if (keyPattern[key] instanceof Array) {
    //                 result[indexes.index][key].push({});
    //             }
    //
    //             indexes[key].currentId = row[key + '.id'];
    //             indexes[key].index = result[indexes.index][key].length - 1;
    //         }
    //     }
    //
    //     var first = {};
    //
    //     if (keyPattern[key] instanceof Array) {
    //         first = keyPattern[key][0];
    //     } else {
    //         first = keyPattern[key];
    //     }
    //
    //     for (key2 in first) {
    //
    //         if (!result[indexes.index][key][indexes[key].index][key2]) {
    //
    //             if (keyPattern[key] instanceof Array) {
    //                 if (keyPattern[key][0][key2] instanceof Object) {
    //                     result[indexes.index][key][indexes[key].index][key2] = {};
    //                 }
    //
    //                 if (keyPattern[key][0][key2] instanceof Array) {
    //                     result[indexes.index][key][indexes[key].index][key2] = [];
    //                 }
    //             } else {
    //                 if (keyPattern[key][key2] instanceof Object) {
    //                     result[indexes.index][key][indexes[key].index][key2] = {};
    //                 }
    //
    //                 if (keyPattern[key][key2] instanceof Array) {
    //                     result[indexes.index][key][indexes[key].index][key2] = [];
    //                 }
    //             }
    //
    //         }
    //
    //         if (row[key + '.' + key2 + '.id']) {
    //             if (row[key + '.' + key2 + '.id'] != indexes[key][key2].currentId) {
    //
    //                 if (keyPattern[key][key2] instanceof Array) {
    //                     result[indexes.index][key][indexes[key].index][key2].push({});
    //                 }
    //
    //                 indexes[key][key2].currentId = row[key + '.' + key2 + '.id'];
    //                 indexes[key][key2].index = result[indexes.index][key][indexes[key].index][key2].length - 1;
    //             }
    //         }
    //
    //         var second = {};
    //
    //         if (keyPattern[key] instanceof Array) {
    //             second = keyPattern[key][key2][0];
    //         } else {
    //             second = keyPattern[key][key2];
    //         }
    //
    //         for (key3 in second) {
    //
    //             if (!result[indexes.index][key][indexes[key].index][key2][indexes[key2].index][key3]) {
    //
    //                 if (keyPattern[key][key2][key3] instanceof Object) {
    //                     result[indexes.index][key][indexes[key].index][key2][indexes[key2].index][key3] = {};
    //                 }
    //                 if (keyPattern[key][key2][key3] instanceof Array) {
    //                     result[indexes.index][key][indexes[key].index][key2][indexes[key2].index][key3] = [];
    //                 }
    //
    //             }
    //
    //             if (row[key + '.' + key2 + '.' + key3 + '.id']) {
    //                 if (row[key + '.' + key2 + '.' + key3 + '.id'] != indexes[key][key2][key3].currentId) {
    //
    //                     if (keyPattern[key][key2][key3] instanceof Array) {
    //                         result[indexes.index][key][indexes[key].index][key2][indexes[key2].index][key3].push({});
    //                     }
    //
    //                     indexes[key][key2][key3].currentId = row[key + '.' + key2 + '.' + key3 + '.id'];
    //                     indexes[key][key2][key3].index = result[indexes.index][key][indexes[key].index][key2][indexes[key2].index][key3].length - 1;
    //                 }
    //             }
    //         }
    //     }
    // }

};