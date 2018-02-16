var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var top = require('./' + resource + '.top.js');
var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var put = require('./' + resource + '.put.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains : {
                    'id': '데이터를 얻을 리소스의 id'
                },
                param: 'id',
                title: '단일 얻기',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    gets : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['last', 'size', 'userId'],
                essential: [],
                resettable: [],
                explains : {
                    'userId': '유저별 필터링',
                    'last': '마지막 데이터',
                    'size': '몇개 로드할지에 대한 사이즈'
                },
                title: '',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.setParam());
                apiCreator.add(gets.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    'CPID', //가맹점ID
                    //'ORDERNO', //주문번호
                    'PRODUCTTYPE', //상품구분(1: 디지털, 2: 실물)
                    //'BILLTYPE', //과금 유형(1: 일반)
                    'TAXFREECD', //"과세 비과세 여부(00: 과세, 01: 비과세)"
                    'AMOUNT', //결제금액
                    'QUOTAOPT', //최대 할부 개월 수
                    'PRODUCTNAME', //상품명
                    'EMAIL', //고객 E-MAIL(결제결과 통보 Default)
                    "USERID", //고객 ID
                    "USERNAME", //고객명
                    "PRODUCTCODE", //상품코드
                    "RESERVEDINDEX1", //예약항목1(내부에서 INDEX로 관리)
                    "RESERVEDINDEX2", //예약항목2(내부에서 INDEX로 관리)
                    "RESERVEDSTRING", //예약항목3
                    "RETURNURL", //결제 성공 후, 이동할 URL(새 창)
                    "HOMEURL", //"결제 성공 후, 이동할 URL(결제 창에서 이동)"
                    "DIRECTRESULTFLAG", //"다우페이 결제 완료 창 없이HOMEURL로 바로 이동"
                    "used_card_YN", //"결제창 카드사 노출 여부(Y : used_card 사용)"
                    "used_card", //결제창 카드사 노출 값
                    "not_used_card", //결제창 카드사 노출제한
                    "kcp_site_logo", //결제창 상단에 나타날 가맹점이로고
                    "kcp_site_img" //결제창 하단에 나타날 가맹점문구
                ],
                essential: [
                    'CPID',
                    //'ORDERNO',
                    'PRODUCTTYPE',
                    //'BILLTYPE',
                    'TAXFREECD',
                    'AMOUNT',
                    'QUOTAOPT',
                    'PRODUCTNAME'
                ],
                resettable: [],
                explains : {
                    body: ''
                },
                defaults: {

                },
                title: '신고하기',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                // apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.setParam());
                apiCreator.add(post.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    put : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: ['body'],
                essential: ['body'],
                resettable: [],
                explains : {
                    'body': '수정할 신고 내용',
                    'id': '데이터 리소스의 id'
                },
                title: '수정',
                param: 'id',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(top.hasAuthorization());
                apiCreator.add(put.updateReport());
                apiCreator.add(put.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    delete : function(isOnlyParams) {
        return function(req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains : {
                    'id': '데이터 리소스의 id'
                },
                title: '제거',
                param: 'id',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(top.hasAuthorization());
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:id', api.get());
router.get('/' + resource, api.gets());
router.post('/' + resource, api.post());
router.put('/' + resource + '/:id', api.put());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;