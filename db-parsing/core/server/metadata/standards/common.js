var standards = {
    "host": {
        "url": "http://localhost:8080"
    },
    "local": {
        "uploadUrl": "uploads",
        "tempUrl": "temp"
    },
    "cdn": {
        "rootUrl": "",
        "staticsUrl": ""
    },
    "templatePath": "/pages/",
    "replaceApi": {
        "userDel": ""
    },
    "admin": {
        "kNavigation": "navigation",
        "modules": ["users", "notices", "reports", "terms", "images", "notification", "company-info", "dashboard-info"],
        "moduleUsers": "users",
        "moduleNotices": "notices",
        "moduleReports": "reports",
        "moduleTerms": "terms",
        "moduleImages": "images",
        "moduleNotification": "notifications",
        "moduleMassNotifications": "mass-notifications",
        "moduleCompanyInfo": "company-info",
        "moduleDashboardInfo": "dashboard-info",
        "isUseModalAnimation": true,
        "modalBackDrop": true
    },
    "profile": {
        "enableProfileItems": ["nick", "gender", "birth", "language", "country", "comment", "pfImgId", "website", "role", "name"],
        "includeProfileItems": []
    },
    "notification": {
        "notificationTypeNotice": "notice",
        "notificationTypeEvent": "event",
        "notificationTypeEmergency": "emergency",
        "notificationTypeApplication": "application",
        "enumSendTypes": ["email", "push", "message"],
        "sendTypeEmail": "email",
        "sendTypePush": "push",
        "sendTypeMessage": "message",
        "enumSendMethods": ["sms", "lms", "mms"],
        "sendMethodSms": "sms",
        "sendMethodLms": "lms",
        "sendMethodMms": "mms",
        "maxKeyLength": 100,
        "minKeyLength": 1,
        "maxTitleLength": 60,
        "minTitleLength": 1,
        "maxBodyLength": 100000,
        "minBodyLength": 1,
        "maxPushBodyLength": 60,
        "minPushBodyLength": 1,
        "maxDataLength": 60,
        "minDataLength": 1,
        "maxImgLength": 60,
        "minImgLength": 1,
        "maxDescriptionLength": 60,
        "minDescriptionLength": 1,
        "enumSearchFields": ["notificationName", "messageTitle", "messageBody"],
        "enumOrderBys": ["createdAt", "updatedAt"],
        "defaultOrderBy": "createdAt",
        "bodyDataType": "long",
        "defaultCount": 0,
        "defaultProgress": 0,
        "wrongPhoneNum": "wrongPhoneNum",
        "minMessageTitleLength": 1,
        "maxMessageTitleLength": 30,
        "pushSound": "default",
        "modalSize": "md"
    },
    "massNotification": {
        "enumValidImageExtensions": ['jpg'],
        "minImageCount": 0,
        "maxImageCount": 1,
        "minImageBytes": 0,
        "maxImageBytes": 20480,
        "maxSmsBody": 90,
        "maxLmsBody": 2000,
        "maxMmsBody": 2000
    },
    "massNotificationImportHistory": {
        "maxRawSize": 2000
    },
    "notificationBox": {
        "defaultLoadingLength": 8,
        "enumOrders": ["createdAt"],
        "defaultOrderBy": "createdAt"
    },
    "user": {
        "enumPhones": ["ios", "android"],
        "phoneIOS": "ios",
        "phoneAndroid": "android",
        "enumGenders": ["m", "f"],
        "genderMale": "m",
        "genderFemale": "f",
        "genderAll": "genderAll",
        "enumAuthTypes": ["emailSignup", "phoneSignup", "emailFindPass", "phoneFindPass", "phoneFindId", "emailAdding", "phoneAdding", "phoneLogin", "emailFindId", "phoneChange"],
        "enumAuthPhoneTypes": ["phoneSignup", "phoneFindPass", "phoneFindId", "phoneAdding", "phoneLogin", "phoneChange"],
        "enumAuthEmailTypes": ["emailSignup", "emailFindPass", "emailAdding", 'emailFindId'],
        "authEmailSignup": "emailSignup",
        "authEmailAdding": "emailAdding",
        "authEmailFindPass": "emailFindPass",
        "authEmailFindId": "emailFindId",
        "authPhoneSignup": "phoneSignup",
        "authPhoneFindPass": "phoneFindPass",
        "authPhoneFindId": "phoneFindId",
        "authPhoneAdding": "phoneAdding",
        "authPhoneLogin": "phoneLogin",
        "authPhoneChange": "phoneChange",
        "enumSignUpTypes": ["email", "phone", "social", "phoneId", "normalId", "phoneEmail", "authCi"],
        "signUpTypeEmail": "email",
        "signUpTypePhone": "phone",
        "signUpTypePhoneId": "phoneId",
        "signUpTypePhoneEmail": "phoneEmail",
        "signUpTypeNormalId": "normalId",
        "signUpTypeSocial": "social",
        "signUpTypeAuthCi": 'authCi',
        "defaultSignUpType": "email",
        "enumProviders": ["facebook", "twitter", "google", "kakao"],
        "providerFacebook": "facebook",
        "providerTwitter": "twitter",
        "providerGoogle": "google",
        "providerKakao": "kakao",
        "enumDeviceTypes": ["ios", "android", "winos", "blackberry"],
        "deviceTypeIOS": "ios",
        "deviceTypeAndroid": "android",
        "enumRoles": ["roleA", "roleB", "roleC", "roleD", "roleE", "roleF", "roleG", "roleS"],
        "enumAssignRoles": ["roleA", "roleB", "roleC"],
        "roleUnauthorizedUser": "roleA",
        "roleUser": "roleB",
        "roleHeavyUser": "roleC",
        "roleAdmin": "roleD",
        "roleSuperAdmin": "roleE",
        "roleUltraAdmin": "roleF",
        "roleSuperUltraAdmin": "roleG",
        "roleSupervisor": "roleS",
        "roleAll": "roleAll",
        "enumLinkIdPassTypes": ["email", "normal"],
        "linkIdPassEmail": "email",
        "linkIdPassNormal": "normal",
        "minAidLength": 2,
        "maxAidLength": 40,
        "minNickLength": 2,
        "maxNickLength": 14,
        "minNameLength": 2,
        "maxNameLength": 40,
        "minSecretLength": 6,
        "goodSecretLength": 9,
        "maxSecretLength": 350,
        "emailTokenLength": 121,
        "phoneTokenLength": 4,
        "minPhoneNumLength": 4,
        "maxPhoneNumLength": 30,
        "minIdLength": 4,
        "maxIdLength": 14,
        "expiredEmailTokenMinutes": 120,
        "expiredPhoneTokenMinutes": 3,
        "maxCommentLength": 200,
        "minCommentLength": 1,
        "minCiLength": 1,
        "maxCiLength": 1000,
        "minDiLength": 1,
        "maxDiLength": 1000,
        "minTransactionLength": 1,
        "maxTransactionLength": 1000,
        "enableProvider": ["facebook"],
        "defaultAgreedEmail": true,
        "defaultAgreedPhoneNum": true,
        "enumOrders": ["orderCreate", "orderUpdate"],
        "orderCreate": "orderCreate",
        "orderUpdate": "orderUpdate",
        "enumSearchFields": ["nick", "gender", "email", "phoneNum", "birth", "name"],
        "nick": "nick",
        "gender": "gender",
        "email": "email",
        "phoneNum": "phoneNum",
        "birth": "birth",
        "name": "name",
        "defaultPfImg": "http://d16s4e1wnewfvs.cloudfront.net/user/thumb_static_sloger.png",
        "deletedUserStoringDay": 10,
        "quiescenceUserPivotDay": 365,
        "modalSize": "lg",
        "enumAuthType": ["signup", "addPhone", "changePhone"],
        "authTypeSingUp": "signup",
        "authTypeAddPhone": "addPhone",
        "authTypeChangePhone": "changePhone"
    },
    "flag": {
        "isMoreSocialInfo": true, // 소셜가입할때 추가정보가 필요할경우.
        "isResponsive": true
    },
    "category": {
        "minNameLength": 1,
        "maxNameLength": 25
    },
    "article": {
        "maxNoticeLength": 100,
        "minTitleLength": 1,
        "maxTitleLength": 80,
        "minBodyLength": 1,
        "maxBodyLength": 10000,
        "maxTagCount": 20,
        "maxPageSize": 10
    },
    "comment": {
        "minBodyLength": 1,
        "maxBodyLength": 10000,
        "maxPositionNumberLength": 14,
        "maxDepth": 2
    },
    "terms": {
        "enumTypes": ["essential", "optional"],
        "typeEssential": "essential",
        "typeOptional": "optional",
        "contentDataType": "long",
        "minContentLength": 2,
        "maxContentLength": 100000,
        "minTitleLength": 2,
        "maxTitleLength": 40,
        "enumSearchFields": ["id", "title"],
        "enumOrderBys": ["createdAt", "updatedAt"],
        "defaultOrderBy": "createdAt",
        "showAgreeTerms": "showAgreeTerms",
        "modalSize": "md",
        "maxOptionalTermsCount": 10
    },
    "report": {
        "minBodyLength": 1,
        "maxBodyLength": 10000,
        "minReplyLength": 1,
        "maxReplyLength": 10000,
        "minNickLength": 1,
        "maxNickLength": 14,
        "enumSearchFields": ["nick", "email", "body"],
        "enumSolved": ["solved", "unsolved"],
        "solved": "solved",
        "unsolved": "unsolved",
        "modalSize": "md"
    },
    "notice": {
        "minTitleLength": 1,
        "maxTitleLength": 30,
        "minBodyLength": 1,
        "maxBodyLength": 100000,
        "enumNoticeTypes": ["notice", "faq", "what", "event", "popup"],
        "noticeTypeNormal": "notice",
        "noticeTypeFaq": "faq",
        "noticeTypeWhat": "what",
        "noticeTypeEvent": "event",
        "noticeTypePopup": "popup",
        "enumFields": ["title", "body"],
        "modalSize": "md"
    },
    "board": {
        "minSlugLength": 1,
        "maxSlugLength": 1000
    },
    "image": {
        "enumOrders": ["orderCreate", "orderUpdate"],
        "orderCreate": "orderCreate",
        "orderUpdate": "orderUpdate",
        "enumAuthorized": ["authorized", "unauthorized"],
        "authorized": "authorized",
        "unauthorized": "unauthorized",
        "enumSearchFields": ["id"],
        "enumSearchFieldsUser": ["id", "nick", "name"],
        "defaultSearchFields": "nick",
    },
    "audio": {
        "enumOrders": ["orderCreate", "orderUpdate"],
        "orderCreate": "orderCreate",
        "orderUpdate": "orderUpdate",
        "enumAuthorized": ["authorized", "unauthorized"],
        "authorized": "authorized",
        "unauthorized": "unauthorized",
        "enumSearchFields": ["id"],
        "enumSearchFieldsUser": ["id", "nick", "name"],
        "defaultSearchFields": "nick",
    },
    "magic": {
        "reset": ":RESET:",
        "default": ":DEFAULT:",
        "id": ":ID:",
        "nick": ":NICK:",
        "authNum": ":AUTH_NUM:",
        "minute": ":MINUTE:",
        "total": ":TOTAL:",
        "sender": ":SENDER:",
        "empty": ":EMPTY:",
        "itemDay": ":DAY:",
        "item2Week": ":2WEEK:",
        "item4Week": ":4WEEK:",
        "item12Week": ":12WEEK:",
        "item24Week": ":24WEEK:",
        "item48Week": ":48WEEK:",
        "pass": ":PASS:"
    },
    "common": {
        "deletedRowPrefix": "deleted_",
        "wordMaxLength": 100000,
        "wordMinLength": 1,
        "oidLength": 24,
        "defaultLoadingLength": 12,
        "defaultLoadingAdminLength": 36,
        "defaultLast": 0,
        "loadingMaxLength": 36,
        "enumLoadTypes": ["blog", "page"],
        "loadTypeBlog": "blog",
        "loadTypePage": "page",
        "enumSortTypes": ["DESC", "ASC"],
        "DESC": "DESC",
        "ASC": "ASC",
        "id": "id",
        "all": "all"
    },
    "file": {
        "enumFolders": ["images", "audios", "videos", "etc"],
        "enumImageFolders": ["user", "common", "bg", "article", "attach", "chat", "ck", "notification", "maintenance"],
        "enumAudioFolders": [],
        "enumVideoFolders": [],
        "enumEtcFolders": ["notification", "message"],
        "folderEtc": "etc",
        "folderImages": "images",
        "folderAudios": "audios",
        "folderVideos": "videos",
        "folderUser": "user",
        "folderCommon": "common",
        "folderArticle": "article",
        "folderAttach": "attach",
        "folderBg": "bg",
        "folderChat": "chat",
        "folderCk": "ck",
        "folderNotification": "notification",
        "folderMessage": "message",
        "folderMaintenance": "maintenance",
        "minCount": 1,
        "maxCount": 20,
        "enumValidCsvExtensions": ["csv", "CSV"],
        "enumValidAudioExtensions": ["3GP", "AIFF", "AAC", "ALAC", "AMR", "ATRAC", "AU", "AWB", "dvf", "flac", "mmf", "mp3", "Mpc", "msv", "ogg", "Opus", "TTA", "VOX", "WAV", "wma"],
        "enumValidImageExtensions": ["jpg", "jpeg", "png", "gif"],
        "enumValidVideoExtensions": ["mp4", "mkv", "avi", "wmv", "flv", "ogv", "m4p", "m4v", "yuv", "mov"],
        "enumInvalidFileExtensions": ["exe", "js", "php", "jsp", "aspx", "asp", "html", "htm", "css"],
        "enumPrefixes": ["s_", "m_", "l_"],
        "prefixSmall": "s_",
        "prefixMedium": "m_",
        "prefixLarge": "l_",
        "userSize": [{
            "w": 50,
            "h": 50
        }, {
            "w": 200,
            "h": 200
        }, {
            "w": 400,
            "h": 400
        }],
        "commonSize": [{
            "w": 100,
            "h": null
        }, {
            "w": 300,
            "h": null
        }, {
            "w": 600,
            "h": null
        }],
        "bgSize": [{
            "w": 200,
            "h": 50
        }, {
            "w": 800,
            "h": 200
        }, {
            "w": 1600,
            "h": 400
        }]
    },
    "sms": {
        "timeout": 180000,
        "serverTimeout": 190000,
        "authNumLength": 6
    },
    "metadata": {
        "enumMetaTypes": ["std", "langs", "local", "codes"],
        "metaTypeStandards": "std",
        "metaTypeLanguages": "langs",
        "metaTypeLocalization": "local",
        "metaTypeCodes": "codes"
    },
    "prefix": {
        "account": "accounts",
        "board": "boards",
        "profile": "profile",
        "admin": "admin",
        "terms": "terms"
    },
    "cluster": {
        "defaultExecutionDelay": 1000
    },
    "role": {
        "account": "roleD",
        "report": "roleD"
    },
    "loading": {
        "spinnerKey": "spinner"
    },
    "companyInfo": {
        "minCompanyNameLength": 1,
        "maxCompanyNameLength": 100,
        "minRepresentativeLength": 1,
        "maxRepresentativeLength": 100,
        "minRegNumLength": 1,
        "maxRegNumLength": 20,
        "minPrivateInfoManagerLength": 1,
        "maxPrivateInfoManagerLength": 100,
        "minCommunicationsRetailReportLength": 1,
        "maxCommunicationsRetailReportLength": 100,
        "minAddressLength": 1,
        "maxAddressLength": 1000,
        "minContactLength": 1,
        "maxContactLength": 100,
        "minEmailLength": 1,
        "maxEmailLength": 100
    },
    "dialog": {
        "isUseAnimation": true
    },
    "chat": {
        "noSessionChatPort": 5001,
        "noSessionChatUrl": "http://localhost:5001",
        "userRoomPrefix": "u",
        "clientRequestJoinRoom": "clientRequestJoinRoom",
        "clientCreateRoom": "clientCreateRoom",
        "clientJoinRoom": "clientJoinRoom",
        "clientJoinAllRooms": "clientJoinAllRooms",
        "clientLeaveRoom": "clientLeaveRoom",
        "clientTyping": "clientTyping",
        "clientSendMessage": "clientSendMessage",
        "clientReadMessage": "clientReadMessage",
        "serverRequestJoinRoom": "serverRequestJoinRoom",
        "serverJoinRoom": "serverJoinRoom",
        "serverJoinUser": "serverJoinUser",
        "serverJoinAllRooms": "serverJoinAllRooms",
        "serverLeaveRoom": "serverLeaveRoom",
        "serverLeaveUser": "serverLeaveUser",
        "serverTyping": "serverTyping",
        "serverCheckMessage": "serverCheckMessage",
        "serverReceiveMessage": "serverReceiveMessage",
        "serverReadMessage": "serverReadMessage",
        "serverRequestFail": "serverRequestFail"
    },
    "chatHistory": {
        "minMessageLength": 1,
        "maxMessageLength": 10000,
        "chatHistoryEnum": ["text", "join", "leave", "image", "media"],
        "text": "text",
        "join": "join",
        "leave": "leave",
        "image": "image",
        "media": "media"
    },
    "dashboard": {
        "defaultCount": 1
    },
    "timeZone": 0,
    "loginHistory": {
        "maxDuplicateLoginCount": 10
    },
    "mobile": {
        "enumOsType": ["android", "ios"],
        "osTypeAndroid": "android",
        "osTypeIos": "ios",
        "minVersionLength": 5,
        "maxVersionLength": 15
    },
    "log": {
        "folderName": "logs"
    },
    "pay": {
        "lguplus": {
            "enumStatus": ["wait", "finish", "fail"],
            "statusWait": "wait",
            "statusFinish": "finish",
            "statusFail": "fail",

            "payMethodCard": "SC0010",
            "payMethodAccount": "SC0030",

            "startAcceptable": ["LGD_AMOUNT", "LGD_BUYER", "LGD_PRODUCTINFO", "LGD_BUYEREMAIL", "LGD_CUSTOM_USABLEPAY"],
            "startEssential": ["LGD_AMOUNT", "LGD_BUYER", "LGD_PRODUCTINFO", "LGD_CUSTOM_USABLEPAY"],
            "finishAcceptable": ["LGD_OID", "LGD_CARDACQUIRER", "LGD_IFOS", "LGD_MID", "LGD_FINANCENAME", "LGD_PCANCELFLAG", "LGD_FINANCEAUTHNUM", "LGD_DELIVERYINFO", "LGD_AFFILIATECODE", "LGD_TRANSAMOUNT", "LGD_BUYERID", "LGD_CARDNUM", "LGD_RECEIVERPHONE", "LGD_2TR_FLAG", "LGD_DEVICE", "LGD_TID", "LGD_FINANCECODE", "LGD_CARDNOINTYN", "LGD_CARDNOINTEREST_YN", "LGD_PCANCELSTR", "LGD_IDPKEY", "LGD_BUYERPHONE", "LGD_ESCROWYN", "LGD_PAYTYPE", "LGD_VANCODE", "LGD_EXCHANGERATE", "LGD_BUYERSSN", "LGD_CARDINSTALLMONTH", "LGD_PAYDATE", "LGD_PRODUCTCODE", "LGD_HASHDATA", "LGD_CARDGUBUN1", "LGD_CARDGUBUN2", "LGD_BUYERADDRESS", "LGD_RECEIVER", "LGD_RESPCODE", "LGD_RESPMSG","LGD_DISCOUNTUSEYN","LGD_ISPKEY","LGD_DISCOUNTUSEAMOUNT", "LGD_AMOUNT", "LGD_BUYER", "LGD_PRODUCTINFO", "LGD_TIMESTAMP"],
            "finishEssential": ["LGD_OID"],
        }
    },
    "pgPurchase": {
        "startAcceptable": ["pgType"],
        "finishAcceptable": ["pgType"],
        "enumStatus": ["wait", "finish", "fail"],
        "statusWait": "wait",
        "statusFinish": "finish",
        "statusFail": "fail",
        "enumPgType": ['lguplus'],
        "pgTypeLguplus": "lguplus"
    },
    "inAppPurchase": {
        "enumStatus": ["start", "finish"],
        "statusStart": "start",
        "statusFinish": "finish"
    },
    "taxInvoice": {
        "enumStates": ["taxInvoiceStandby", "taxInvoicePublished"],
        "defaultState": "taxInvoiceStandby",
        "taxInvoiceStandby": "taxInvoiceStandby",
        "taxInvoicePublished": "taxInvoicePublished",

        "enumChargeDirections": ["정과금", '역과금'],
        "defaultChargeDirection": "정과금",

        "enumIssueTypes": ["정발행", "역발행", "위수탁"],
        "defaultIssueType": "정발행",

        "enumPurposeTypes": ["직접발행", "승인시자동발행"],
        "defaultPurposeType": "직접발행",

        "enumTaxTypes": ["과세", "영세", "면세"],
        "defaultTaxType": "과세",

        "enumInvoiceeTypes": ["사업자", "개인", "외국인"],
        "defaultInvoiceeType": "사업자"
    }
};

module.exports = standards;
