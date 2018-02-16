var META = require('../../../bridge/metadata/index');
var STD = META.std;
var should = require('should');

var type = {
    STRING: "string",
    ENUM: "enum+",
    NUMBER: "number",
    BOOLEAN: "boolean",
    DATE: "date",
    STRING_ALLOW_EMPTY: "string_allow_empty",
    ENUM_ALLOW_EMPTY: "enum_allow_empty+",
    NUMBER_ALLOW_EMPTY: "number_allow_empty",
    BOOLEAN_ALLOW_EMPTY: "boolean_allow_empty",
    DATE_ALLOW_EMPTY: "date_allow_empty",
    STRING_ALLOW_NULL: "string_allow_null",
    ENUM_ALLOW_NULL: "enum_allow_null+",
    NUMBER_ALLOW_NULL: "number_allow_null",
    BOOLEAN_ALLOW_NULL: "boolean_allow_null",
    DATE_ALLOW_NULL: "date_allow_null"
};

module.exports.type = type;

module.exports.do = function (form, body) {

    var self = this;

    function innerCheck(form, body, k) {
        if (form[k] instanceof Object || form[k] instanceof Array) {
            if (body[k]) {
                self.do(form[k], body[k]);
            }
        }
        else if (form[k] == type.STRING ||
            form[k].indexOf("enum+") != -1 ||
            form[k] == type.NUMBER ||
            form[k] == type.BOOLEAN ||
            form[k] == type.DATE) {
            body.should.have.a.property(k);

            if (form[k] == type.STRING) {
                body[k].should.be.an.String;
            } else if (form[k].indexOf("enum+") != -1) {

                var enumType = form[k].split("+");
                var enumTypeKey = enumType[1];
                var enumTypeArray = enumTypeKey.split(",");
                for (var i = 0; i < enumTypeArray.length; ++i) {
                    if (body[k] == enumTypeArray[i]) {
                        break;
                    }
                }
                body[k].should.an.exactly(enumTypeArray[i]);
            } else if (form[k] == type.NUMBER) {
                body[k].should.be.an.Number;
            } else if (form[k] == type.BOOLEAN) {
                body[k].should.be.an.Boolean;
            } else if (form[k] == type.DATE) {
                body[k].should.be.an.String;
            }
        }
        else if (form[k] == type.STRING_ALLOW_EMPTY ||
            form[k].indexOf("enum_a_e") != -1 ||
            form[k] == type.NUMBER_ALLOW_EMPTY ||
            form[k] == type.BOOLEAN_ALLOW_EMPTY ||
            form[k] == type.DATE_ALLOW_EMPTY) {
            if (body[k]) {
                body.should.have.a.property(k);

                if (form[k] == type.STRING_ALLOW_EMPTY) {
                    body[k].should.be.an.String;
                } else if (form[k].indexOf("enum_a_e") != -1) {
                    var enumType = form[k].split("+");
                    var enumTypeKey = enumType[1];
                    var enumTypeArray = enumTypeKey.split(",");
                    for (var i = 0; i < enumTypeArray.length; ++i) {
                        if (body[k] == enumTypeArray[i]) {
                            break;
                        }
                    }
                    body[k].should.an.exactly(enumTypeArray[i]);
                } else if (form[k] == type.NUMBER_ALLOW_EMPTY) {
                    body[k].should.be.an.Number;
                } else if (form[k] == type.BOOLEAN_ALLOW_EMPTY) {
                    body[k].should.be.an.Boolean;
                } else if (form[k] == type.DATE_ALLOW_EMPTY) {
                    body[k].should.be.an.String;
                }
            }
        }
        else if (form[k] == type.STRING_ALLOW_NULL ||
            form[k].indexOf("enum_a_n") != -1 ||
            form[k] == type.NUMBER_ALLOW_NULL ||
            form[k] == type.BOOLEAN_ALLOW_NULL ||
            form[k] == type.DATE_ALLOW_NULL) {
            body.should.have.a.property(k);

            if (body[k] !== null) {
                if (form[k] == type.STRING_ALLOW_NULL) {
                    body[k].should.be.an.String;
                } else if (form[k].indexOf("enum_a_n") != -1) {
                    var enumType = form[k].split("+");
                    var enumTypeKey = enumType[1];
                    var enumTypeArray = enumTypeKey.split(",");
                    for (var i = 0; i < enumTypeArray.length; ++i) {
                        if (body[k] == STD[enumTypeArray[i]]) {
                            break;
                        }
                    }
                    body[k].should.an.exactly(enumTypeArray[i]);
                } else if (form[k] == type.NUMBER_ALLOW_NULL) {
                    body[k].should.be.an.Number;
                } else if (form[k] == type.BOOLEAN_ALLOW_NULL) {
                    body[k].should.be.an.Boolean;
                } else if (form[k] == type.DATE_ALLOW_NULL) {
                    body[k].should.be.an.String;
                }
            }
        }
    }


    if (form instanceof Array) {
        for (var idx = 0; idx < form.length; ++idx) {
            for (var k in form[idx]) {
                if (body[idx]) {
                    innerCheck(form[idx], body[idx], k);
                }
            }
        }
    } else {
        for (var k in form) {
            innerCheck(form, body, k);
        }
    }

};