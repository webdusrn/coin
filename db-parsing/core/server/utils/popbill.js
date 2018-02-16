var config = require('../../../bridge/config/env');
var STD = require('../../../bridge/metadata/standards');
var sequelize = require('../../server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');
var attachZero = require('../../server/utils/common').attachZero;
var MICRO = require('microtime-nodejs');
var popbill = require('popbill');
var POPBILL = config.popbill;

module.exports = {
    init: function () {
        popbill.config({
            LinkID: POPBILL.linkId,
            SecretKey: POPBILL.secretKey,
            IsTest: POPBILL.isTest,
            defaultErrorHandler: function (error) {
                console.error(error);
            }
        });
    },
    sendTax: function (taxInvoice, callback) {
        var _this = this;
        _this.taxInvoice(POPBILL.regNum, _this.generateTaxInvoice(taxInvoice), function (status, data) {
            if (status == 204) {
                sequelize.models.TaxInvoice.updateDataById(taxInvoice.id, {
                    state: STD.taxInvoice.taxInvoicePublished,
                    publishedAt: MICRO.now()
                }, function (status, data) {
                    if (status == 204) {
                        callback(204);
                    } else {
                        callback(status, data);
                    }
                });
            } else {
                callback(status, data);
            }
        });
    },
    taxInvoice: function (regNum, invoice, callback) {
        var instance = popbill.TaxinvoiceService();
        instance.registIssue(regNum, invoice, function (result) {
            console.log(result.code, result.message);
            callback(204);
        }, function (error) {
            console.error(error.code, error.message);
            callback(400, {
                code: error.code,
                message: error.message
            });
        });
    },
    generateTaxInvoice: function (taxInvoice, now) {
        var _this = this;

        var fields = [
            'chargeDirection',
            'issueType',
            'purposeType',
            'taxType',
            'invoicerCorpNum',
            'invoicerCorpName',
            'invoicerCEOName',
            'invoicerAddr',
            'invoicerBizClass',
            'invoicerBizType',
            'invoicerContactName',
            'invoicerTEL',
            'invoicerHP',
            'invoicerEmail',
            'invoiceeType',
            'invoiceeCorpNum',
            'invoiceeCorpName',
            'invoiceeCEOName',
            'invoiceeAddr',
            'invoiceeBizClass',
            'invoiceeBizType',
            'invoiceeContactName1',
            'invoiceeTEL1',
            'invoiceeHP1',
            'invoiceeEmail1',
            'supplyCostTotal',
            'taxTotal',
            'totalAmount',
            'cash',
            'chkBill',
            'note',
            'credit',
            'remark1'
        ];

        var generate = {
            writeDate: _this.returnWriteDate(taxInvoice.createdAt),
            invoicerMgtKey: taxInvoice.id.toString(),
            detailList: _this.returnDetailList(taxInvoice)
        };

        if (taxInvoice.invoiceeContactName2 && taxInvoice.invoiceeEmail2) {
            generate.addContactList = [{
                serialNum: 1,
                contactName: taxInvoice.invoiceeContactName2,
                email: taxInvoice.invoiceeEmail2
            }];
            if (taxInvoice.invoiceeContactName3 && taxInvoice.invoiceeEmail3) {
                generate.addContactList.push({
                    serialNum: 2,
                    contactName: taxInvoice.invoiceeContactName3,
                    email: taxInvoice.invoiceeEmail3
                });
            }
        }

        fields.forEach(function (field) {
            if (taxInvoice[field] !== null) {
                generate[field] = taxInvoice[field].toString();
            }
        });

        return generate;
    },
    returnWriteDate: function (microTimestamp) {
        var now = new Date(Math.floor(microTimestamp / 1000));
        return now.getFullYear().toString() + attachZero(now.getMonth() + 1) + attachZero(now.getDate());
    },
    returnDetailList: function (taxInvoice) {
        var detailList = [];
        taxInvoice.taxInvoiceItems.forEach(function (taxInvoiceItem) {
            var detailItem = {
                serialNum: taxInvoiceItem.serialNum,
                purchaseDT: taxInvoiceItem.purchaseDT,
                itemName: taxInvoiceItem.itemName,
                qty: taxInvoiceItem.qty.toString(),
                unitCost: taxInvoiceItem.unitCost.toString(),
                supplyCost: taxInvoiceItem.supplyCost.toString(),
                tax: taxInvoiceItem.tax.toString()
            };
            if (taxInvoiceItem.spec) detailItem.spec = taxInvoiceItem.spec;
            if (taxInvoiceItem.remark) detailItem.remark = taxInvoiceItem.remark;
            detailList.push(detailItem);
        });
        return detailList;
    }
};

// var Taxinvoice = {
//
//     // [필수] 작성일자, 날짜형식 yyyyMMdd
//     writeDate : '20161116',
//
//     // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
//     chargeDirection : '정과금',
//
//     // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
//     issueType : '정발행',
//
//     // [필수] (영수, 청구) 중 기재
//     purposeType : '영수',
//
//     // [필수] 발행시점, (직접발행, 승인시자동발행) 중 기재
//     issueTiming : '직접발행',
//
//     // [필수] 과세형태, (과세, 영세, 면세) 중 기재
//     taxType : '과세',
//
//
//     /**************************************************************************
//      *                              공급자 정보
//      **************************************************************************/
//
//     // [필수] 공급자 사업자번호, '-' 제외 10자리
//     invoicerCorpNum : '1234567890',
//
//     // [정발행시 필수] 문서관리번호, 1~24자리 숫자,영문,'-','_' 조합으로 사업자별로
//     invoicerMgtKey : mgtKey,
//
//     // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//     invoicerTaxRegID : '',
//
//     // [필수] 공급자 상호
//     invoicerCorpName : '공급자 상호',
//
//     // [필수] 대표자 성명
//     invoicerCEOName : '대표자 성명',
//
//     // 공급자 주소
//     invoicerAddr : '공급자 주소',
//
//     // 공급자 종목
//     invoicerBizClass : '공급자 업종',
//
//     // 공급자 업태
//     invoicerBizType : '공급자 업태',
//
//     // 공급자 담당자명
//     invoicerContactName : '공급자 담당자명',
//
//     // 공급자 연락처
//     invoicerTEL : '070-4304-2991',
//
//     // 공급자 휴대폰번호
//     invoicerHP : '010-000-111',
//
//     // 공급자 메일주소
//     invoicerEmail : 'test@test.com',
//
//     // 정발행시 알림문자 전송여부
//     // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
//     invoicerSMSSendYN : false,
//
//
//     /**************************************************************************
//      *                           공급받는자 정보
//      **************************************************************************/
//
//     // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 중 기재
//     invoiceeType : '사업자',
//
//     // [필수] 공급받는자 사업자번호, '-'제외 10자리
//     invoiceeCorpNum : '8888888888',
//
//     // [역발행시 필수] 공급받는자 문서관리번호
//     invoiceeMgtKey : '',
//
//     // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//     invoiceeTaxRegID : '',
//
//     // [필수] 공급받는자 상호
//     invoiceeCorpName : '공급받는자 상호',
//
//     // [필수] 공급받는자 대표자 성명
//     invoiceeCEOName : '공급받는자 대표자 성명',
//
//     // 공급받는자 주소
//     invoiceeAddr : '공급받는자 주소',
//
//     // 공급받는자 종목
//     invoiceeBizClass : '공급받는자 종목',
//
//     // 공급받는자 업태
//     invoiceeBizType : '공급받는자 업태',
//
//     // 공급받는자 담당자명
//     invoiceeContactName1 : '공급받는자 담당자명',
//
//     // 공급받는자 연락처
//     invoiceeTEL1 : '010-111-222',
//
//     // 공급받는자 휴대폰번호
//     invoiceeHP1 : '070-111-222',
//
//     // 공급받는자 이메일 주소
//     invoiceeEmail1 : 'test2@test.com',
//
//     // 역발행시 알림문자 전송여부
//     // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
//     invoiceeSMSSendYN : false,
//
//
//     /**************************************************************************
//      *                           세금계산서 기재정보
//      **************************************************************************/
//
//     // [필수] 공급가액 합계
//     supplyCostTotal : '10000',
//
//     // [필수] 세액합계
//     taxTotal : '1000',
//
//     // [필수] 합계금액 (공급가액 합계 + 세액 합계)
//     totalAmount : '11000',
//
//     // 기재 상 '일련번호'' 항목
//     serialNum : '123',
//
//     // 기재 상 '현금'' 항목
//     cash : '',
//
//     // 기재 상 '수표' 항목
//     chkBill : '',
//
//     // 기재 상 '어음' 항목
//     note : '',
//
//     // 기재 상 '외상' 항목
//     credit : '',
//
//     // 기재 상 '비고' 항목
//     remark1 : '비고',
//     remark2 : '비고2',
//     remark3 : '비고3',
//
//     // 기재 상 '권' 항목, 최대값 32767
//     kwon : '',
//
//     // 기재 상 '호' 항목, 최대값 32767
//     ho : '',
//
//     // 사업자등록증 이미지 첨부여부
//     businessLicenseYN : false,
//
//     // 통장사본 이미지 첨부여부
//     bankBookYN : false,
//
//
//     /**************************************************************************
//      *                           상세항목(품목) 정보
//      **************************************************************************/
//
//     detailList : [
//         {
//             serialNum : 1,                // 일련번호, 1부터 순차기재
//             purchaseDT : '20161115',      // 거래일자, 형식 : yyyyMMdd
//             itemName : '품명1',
//             spec : '규격',
//             qty : '1',                    // 수량, 소수점 2자리까지 기재 가능
//             unitCost : '5000',           // 단가, 소수점 2자리까지 기재 가능
//             supplyCost : '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//             tax : '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//             remark : '비고'
//         },
//         {
//             serialNum : 2,                // 일련번호, 1부터 순차기재
//             purchaseDT : '20161115',      // 거래일자, 형식 : yyyyMMdd
//             itemName : '품명2',
//             spec : '규격',
//             qty : '1',                    // 수량, 소수점 2자리까지 기재 가능
//             unitCost : '5000',           // 단가, 소수점 2자리까지 기재 가능
//             supplyCost : '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//             tax : '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//             remark : '비고'
//         }
//     ],
//
//
//     /**************************************************************************
//      *                         수정세금계산서 기재정보
//      * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
//      * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
//      * - [참고] 수정세금계산서 작성방법 안내 - http://blog.linkhub.co.kr/650
//      **************************************************************************/
//
//     // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
//     modifyCode : '',
//
//     // [수정세금계산서 발행시 필수] 원본세금계산서 ItemKey
//     // - 문서정보확인 (GetInfo API)의 응답결과(ItemKey 항목) 확인
//     originalTaxinvoiceKey : '',
//
//
//     /**************************************************************************
//      *                             추가담당자 정보
//      * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
//      * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
//      **************************************************************************/
//
//     // 추가담당자 정보
//     addContactList : [
//         {
//             // 일련번호, 1부터 순차기재
//             serialNum : 1,
//
//             // 담당자명
//             contactName : '담당자 성명',
//
//             // 담당자 메일
//             email : 'test2@test.com'
//         },
//         {
//             // 일련번호, 1부터 순차기재
//             serialNum : 2,
//
//             // 담당자명
//             contactName : '담당자 성명 2',
//
//             // 담당자 메일
//             email : 'test3@test.com'
//         }
//     ]
// };