import './assets/stylesheets/admin.scss';

import config from './config/app.admin.config';
import routing from './config/app.admin.route';

import AdminCtrl from './controllers/app.admin.controller';
import HeaderCtrl from './controllers/app.admin.header.controller';
import NavigationCtrl from './controllers/app.admin.navigation.controller';
import IndexCtrl from './controllers/app.admin.index.controller';
import LoginCtrl from './controllers/app.admin.login.controller';
import EngineerCtrl from './controllers/app.admin.engineer.controller';
import ReqEstimationCtrl from './controllers/app.admin.req-estimation.controller';
import adminUserCtrl from './controllers/app.admin.users.controller';
import OptionCtrl from './controllers/app.admin.option.controller';
import BlogCtrl from './controllers/app.admin.blog.controller';
import CreateBlogAccountCtrl from './controllers/app.admin.create-blog-account.controller';
import DetailBlogAccountCtrl from './controllers/app.admin.detail-blog-account.controller';
import BlogStatsCtrl from './controllers/app.admin.blog-stats.controller';
import EngineerPhoneNumCtrl from './controllers/app.admin.engineer-phone-num.controller';
import OpenHistoryCtrl from './controllers/app.admin.open-history.controller';
import PointHistoryCtrl from './controllers/app.admin.point-history.controller';
import CreatePointHistoryCtrl from './controllers/app.admin.create-point-history.controller';
import ReqEstimationStatsCtrl from './controllers/app.admin.req-estimation-stats.controller';
import InstallCsCtrl from './controllers/app.admin.install-cs.controller';
import DetailInstallCsCtrl from './controllers/app.admin.detail-install-cs.controller';
import VbankCtrl from './controllers/app.admin.vbank.controller';
import BizMsgCtrl from './controllers/app.admin.biz-msg.controller';
import AsHistoryCtrl from './controllers/app.admin.as-history.controller';
import DetailAsHistoryCtrl from './controllers/app.admin.detail-as-history.controller';
import PremiumInfoCtrl from './controllers/app.admin.premium-info.controller';
import ContractInfoCtrl from './controllers/app.admin.contract-info.controller';
import PremiumPriceCtrl from './controllers/app.admin.premium-price.controller';
import DetailPremiumInfoCtrl from './controllers/app.admin.detail-premium-info.controller';
import DetailContractInfoCtrl from './controllers/app.admin.detail-contract-info.controller';
import ReqEstimationCreateCtrl from './controllers/app.admin.req-estimation-create.controller';


import CreateEngineerCtrl from './controllers/app.admin.create-engineer.controller';
import createEngineer from './directives/create-engineer/app.admin.create-engineer';
import DetailReqEstimationCtrl from './controllers/app.admin.detail-req-estimation.controller';
import detailReqEstimation from './directives/detail-req-estimation/app.admin.detail-req-estimation';
import userEstimationsInfoCtrl from './controllers/app.admin.user-estimations-info.controller';
import userEstimations from './directives/user-estimations/app.admin.user-estimations';
import memoCtrl from './controllers/app.admin.memo.controller';
import memo from './directives/memo/app.admin.memo';
import reqEstimationStats from './directives/req-estimation-stats/app.admin.req-estimation-stats';
import premiumPrice from './directives/premium-price/app.admin.premium-price';
import detailPremiumInfo from './directives/detail-premium-info/app.admin.detail-premium-info';
import detailContractInfo from './directives/detail-contract-info/app.admin.detail-contract-info';

import appResources from './services/app.admin.constant';

import Engineer from './services/app.admin.engineer.model';
import ReqEstimation from './services/app.admin.req-estimation.model';
import User from './services/app.admin.user.model';
import EngineerInfo from './services/app.admin.engineer-info.model';
import Option from './services/app.admin.option.model';
import BlogAccount from './services/app.admin.blog-account.model';
import BlogSending from './services/app.admin.blog-sending.model';
import AutoBlogPost from './services/app.admin.auto-blog-post.model';
import BlogPost from './services/app.admin.blog-post.model';
import BlogStats from './services/app.admin.blog-stats.model';
import BlogTemplate from './services/app.admin.blog-template.model';
import BlogSearch from './services/app.admin.blog-search.model';
import EngineerPhoneNum from './services/app.admin.engineer-phone-num.model';
import PointHistory from './services/app.admin.point-history.model';
import EngineerImage from './services/app.admin.engineer-image.model';
import ReqEstimationStats from './services/app.admin.req-estimation-stats.model';
import InstallCs from './services/app.admin.install-cs.model';
import CsMemo from './services/app.admin.cs-memo.model';
import EstimationSuccess from './services/app.admin.estimation-success.model';
import Vbank from './services/app.admin.vbank.model';
import BlogInstancePost from './services/app.admin.blog-instance-post.model';
import BlogInstanceSending from './services/app.admin.blog-instance-sending.model';
import VbankAmount from './services/app.admin.vbank-amount.model';
import BizMsg from './services/app.admin.biz-msg.model';
import AsHistory from './services/app.admin.as-history.model';
import PremiumInfo from './services/app.admin.premium-info.model';
import PremiumPrice from './services/app.admin.premium-price.model';
import PremiumInfoAuthorization from './services/app.admin.premium-info-authorization.model';
import PremiumInfoUnauthorization from './services/app.admin.premium-info-unauthorization.model';
import PremiumInfoLastComplete from './services/app.admin.premium-info-last-complete.model';
import ContractInfo from './services/app.admin.contract-info.model';
import ContractInfoAuthorization from './services/app.admin.contract-info-authorization.model';
import ContractInfoUnauthorization from './services/app.admin.contract-info-unauthorization.model';
import ContractInfoComplete from './services/app.admin.contract-info-complete.model';
import ContractInfoUncomplete from './services/app.admin.contract-info-uncomplete.model';
import ContractInfoLastComplete from './services/app.admin.contract-info-last-complete.model';
import UserPhone from './services/app.admin.user-phone.model';
import IsCanPremium from './services/app.admin.is-can-premium.model';
import IsCanContract from './services/app.admin.is-can-contract.model';
import ReqEstimationUser from './services/app.admin.req-estimation-user.model';
import GeoGraphyInfo from './services/app.admin.geo-graphy-info.model';

import navigator from './services/app.admin.navigator';
import engineerManager from './services/app.admin.engineer.manager';
import reqEstimationsManager from './services/app.admin.req-estimations.manager';
import userManager from './services/app.admin.user.manager';
import optionsManager from './services/app.admin.options.manager';
import blogAccountsManager from './services/app.admin.blog-accounts.manager';
import blogSendingManager from './services/app.admin.blog-sending.manager';
import autoBlogPostManager from './services/app.admin.auto-blog-post.manager';
import blogPostsManager from './services/app.admin.blog-posts.manager';
import blogStatsManager from './services/app.admin.blog-stats.manager';
import blogTemplatesManager from './services/app.admin.blog-templates.manager';
import blogSearchManager from './services/app.admin.blog-search.manager';
import engineerPhoneNumsManager from './services/app.admin.engineer-phone-nums.manager';
import pointHistoriesManager from './services/app.admin.point-histories.manager';
import reqEstimationStatsManager from './services/app.admin.req-estimation-stats.manager';
import installCsManager from './services/app.admin.install-cs.manager';
import vbanksManager from './services/app.admin.vbanks.manager';
import blogInstanceManager from './services/app.admin.blog-instance.manager';
import bizMsgManager from './services/app.admin.biz-msg.manager';
import asHistoriesManager from './services/app.admin.as-histories.manager';
import premiumInfosManager from './services/app.admin.premium-infos.manager';
import premiumPricesManager from './services/app.admin.premium-prices.manager';
import contractInfosManager from './services/app.admin.contract-infos.manager';

import numbers from './filters/app.admin.numbers.filter';
import verify from './filters/app.admin.verify.filter';
import timestampToDate from './filters/app.admin.timestamp-to-date.filter';
import returnPhoneNum from './filters/app.admin.return-phone-num.filter';
import nullToZero from './filters/app.admin.null-to-zero.filter';
import nullToNo from './filters/app.admin.null-to-no.filter';
import attachZero from './filters/app.admin.attach-zero.filter';
import returnSignUpCheck from './filters/app.admin.return-sign-up-check.filter';
import returnTrueFalse from './filters/app.admin.return-true-false,filter';
import perDate from './filters/app.admin.per-date.filter';
import perMonth from './filters/app.admin.per-month.filter';
import reqEstimationStatsTotal from './filters/app.admin.req-estimation-stats-total.filter';
import dateToTimestamp from './filters/app.admin.date-to-timestamp.filter';

import createBlogAccount from './directives/create-blog-account/app.admin.create-blog-account';
import blogStats from './directives/blog-stats/app.admin.blog-stats';
import detailBlogAccount from './directives/detail-blog-account/app.admin.detail-blog-account';
import blogDiagram from './directives/blog-diagram/app.admin.blog-diagram';
import openHistory from './directives/open-history/app.admin.open-history';
import createPointHistory from './directives/create-point-history/app.admin.create-point-history';
import detailInstallCs from './directives/detail-install-cs/app.admin.detail-install-cs';
import detailAsHistory from './directives/detail-as-history/app.admin.detail-as-history';


const APP_NAME = "app.admin";


angular.module(APP_NAME, ['app.admin-core', 'app.admin.template'])
    .config(config)
    .config(routing)
    .controller("AdminCtrl", AdminCtrl)
    .controller("HeaderCtrl", HeaderCtrl)
    .controller("NavigationCtrl", NavigationCtrl)
    .controller("IndexCtrl", IndexCtrl)
    .controller("LoginCtrl", LoginCtrl)
    .controller("EngineerCtrl", EngineerCtrl)
    .controller("ReqEstimationCtrl", ReqEstimationCtrl)
    .controller("adminUserCtrl", adminUserCtrl)
    .controller("OptionCtrl", OptionCtrl)
    .controller("BlogCtrl", BlogCtrl)
    .controller("CreateBlogAccountCtrl", CreateBlogAccountCtrl)
    .controller("DetailBlogAccountCtrl", DetailBlogAccountCtrl)
    .controller("BlogStatsCtrl", BlogStatsCtrl)
    .controller("EngineerPhoneNumCtrl", EngineerPhoneNumCtrl)
    .controller("OpenHistoryCtrl", OpenHistoryCtrl)
    .controller("PointHistoryCtrl", PointHistoryCtrl)
    .controller("CreatePointHistoryCtrl", CreatePointHistoryCtrl)
    .controller("InstallCsCtrl", InstallCsCtrl)
    .controller("DetailInstallCsCtrl", DetailInstallCsCtrl)
    .controller("VbankCtrl", VbankCtrl)
    .controller("BizMsgCtrl", BizMsgCtrl)
    .controller("AsHistoryCtrl", AsHistoryCtrl)
    .controller("DetailAsHistoryCtrl", DetailAsHistoryCtrl)
    .controller("PremiumInfoCtrl", PremiumInfoCtrl)
    .controller("ContractInfoCtrl", ContractInfoCtrl)
    .controller("PremiumPriceCtrl", PremiumPriceCtrl)
    .controller("DetailPremiumInfoCtrl", DetailPremiumInfoCtrl)
    .controller("DetailContractInfoCtrl", DetailContractInfoCtrl)
    .controller("ReqEstimationCreateCtrl", ReqEstimationCreateCtrl)

    .factory("Option", Option)
    .factory("BlogAccount", BlogAccount)
    .factory("BlogSending", BlogSending)
    .factory("AutoBlogPost", AutoBlogPost)
    .factory("BlogPost", BlogPost)
    .factory("BlogStats", BlogStats)
    .factory("BlogTemplate", BlogTemplate)
    .factory("BlogSearch", BlogSearch)
    .factory("EngineerPhoneNum", EngineerPhoneNum)
    .factory("PointHistory", PointHistory)
    .factory("ReqEstimationStats", ReqEstimationStats)
    .factory("InstallCs", InstallCs)
    .factory("CsMemo", CsMemo)
    .factory("EstimationSuccess", EstimationSuccess)
    .factory("Vbank", Vbank)
    .factory("BlogInstancePost", BlogInstancePost)
    .factory("BlogInstanceSending", BlogInstanceSending)
    .factory("VbankAmount", VbankAmount)
    .factory("BizMsg", BizMsg)
    .factory("AsHistory", AsHistory)
    .factory("PremiumInfo", PremiumInfo)
    .factory("PremiumPrice", PremiumPrice)
    .factory("PremiumInfoAuthorization", PremiumInfoAuthorization)
    .factory("PremiumInfoUnauthorization", PremiumInfoUnauthorization)
    .factory("PremiumInfoLastComplete", PremiumInfoLastComplete)
    .factory("ContractInfo", ContractInfo)
    .factory("ContractInfoAuthorization", ContractInfoAuthorization)
    .factory("ContractInfoUnauthorization", ContractInfoUnauthorization)
    .factory("ContractInfoComplete", ContractInfoComplete)
    .factory("ContractInfoUncomplete", ContractInfoUncomplete)
    .factory("ContractInfoLastComplete", ContractInfoLastComplete)
    .factory("UserPhone", UserPhone)
    .factory("IsCanPremium", IsCanPremium)
    .factory("IsCanContract", IsCanContract)
    .factory("ReqEstimationUser", ReqEstimationUser)
    .factory("GeoGraphyInfo", GeoGraphyInfo)

    .constant("appResources", appResources)
    .service("navigator", navigator)
    .service("engineerManager", engineerManager)
    .service("Engineer", Engineer)
    .service("reqEstimationsManager", reqEstimationsManager)
    .service("ReqEstimation", ReqEstimation)
    .service("User", User)
    .service("EngineerInfo", EngineerInfo)
    .service("userManager", userManager)
    .service("optionsManager", optionsManager)
    .service("blogAccountsManager", blogAccountsManager)
    .service("blogSendingManager", blogSendingManager)
    .service("autoBlogPostManager", autoBlogPostManager)
    .service("blogPostsManager", blogPostsManager)
    .service("blogStatsManager", blogStatsManager)
    .service("blogTemplatesManager", blogTemplatesManager)
    .service("blogSearchManager", blogSearchManager)
    .service("engineerPhoneNumsManager", engineerPhoneNumsManager)
    .service("pointHistoriesManager", pointHistoriesManager)
    .service("reqEstimationStatsManager", reqEstimationStatsManager)
    .service("installCsManager", installCsManager)
    .service("EngineerImage", EngineerImage)
    .service("vbanksManager", vbanksManager)
    .service("blogInstanceManager", blogInstanceManager)
    .service("bizMsgManager", bizMsgManager)
    .service("asHistoriesManager", asHistoriesManager)
    .service("premiumInfosManager", premiumInfosManager)
    .service("premiumPricesManager", premiumPricesManager)
    .service("contractInfosManager", contractInfosManager)



    .controller("CreateEngineerCtrl", CreateEngineerCtrl)
    .directive("createEngineer", createEngineer)
    .controller("DetailReqEstimationCtrl", DetailReqEstimationCtrl)
    .directive("detailReqEstimation", detailReqEstimation)
    .controller("userEstimationsInfoCtrl", userEstimationsInfoCtrl)
    .directive("userEstimations", userEstimations)
    .controller("memoCtrl", memoCtrl)
    .directive("memo", memo)
    .controller("ReqEstimationStatsCtrl", ReqEstimationStatsCtrl)
    .directive("reqEstimationStats", reqEstimationStats)

    .filter("returnPhoneNum", returnPhoneNum)
    .filter("verify", verify)
    .filter("timestampToDate", timestampToDate)
    .filter("nullToZero", nullToZero)
    .filter("nullToNo", nullToNo)
    .filter("numbers", numbers)
    .filter("attachZero", attachZero)
    .filter("returnSignUpCheck", returnSignUpCheck)
    .filter("returnTrueFalse", returnTrueFalse)
    .filter("perDate", perDate)
    .filter("perMonth", perMonth)
    .filter("reqEstimationStatsTotal", reqEstimationStatsTotal)
    .filter("dateToTimestamp", dateToTimestamp)

    .directive('createBlogAccount', createBlogAccount)
    .directive('blogStats', blogStats)
    .directive('blogDiagram', blogDiagram)
    .directive('openHistory', openHistory)
    .directive('createPointHistory', createPointHistory)
    .directive('detailInstallCs', detailInstallCs)
    .directive('detailAsHistory', detailAsHistory)
    .directive('premiumPrice', premiumPrice)
    .directive('detailPremiumInfo', detailPremiumInfo)
    .directive('detailContractInfo', detailContractInfo)
    .directive('detailBlogAccount', detailBlogAccount);


if (window.location.hash === '#_=_') window.location.hash = '';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;