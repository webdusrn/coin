var notifications = {
    "chat": {
        "key": "chat",
        "isStored": false,
        "isOption": true,
        "boxTitle": "kNotiChatTitle",
        "boxBody": "kNotiChatBody",
        "sendTypes": {
            "push": {
                "title": "kNotiChatTitle",
                "body": "kNotiChatBody"
            }
        }
    },
    "report": {
        "key": "report",
        "isStored": true,
        "isOption": true,
        "boxTitle": "kNotiReportTitle",
        "boxBody": "kNotiReportBody",
        "sendTypes": {
            "email": {
                "title": "kNotiReportEmailTitle",
                "body": "kNotiReportEmailBody"
            },
            "push": {
                "title": "kNotiReportPushTitle",
                "body": "kNotiReportPushBody"
            },
            "message": {
                "title": "kNotiReportMessageTitle",
                "body": "kNotiReportMessageBody"
            }
        }
    },
    "public": {
        "notice": {
            "key": "notice",
            "isStored": false,
            "isOption": true,
            "boxTitle": "kNotiNoticeTitle",
            "boxBody": "kNotiNoticeBody",
            "sendTypes": {
                "email": {
                    "title": "kNotiNoticeEmailTitle",
                    "body": "kNotiNoticeEmailBody"
                },
                "push": {
                    "title": "kNotiNoticePushTitle",
                    "body": "kNotiNoticePushBody"
                },
                "message": {
                    "title": "kNotiNoticeMessageTitle",
                    "body": "kNotiNoticeMessageBody"
                }
            }
        },
        "event": {
            "key": "event",
            "isStored": false,
            "isOption": true,
            "boxTitle": "kNotiEventTitle",
            "boxBody": "kNotiEventBody",
            "sendTypes": {
                "email": {
                    "title": "kNotiEventEmailTitle",
                    "body": "kNotiEventEmailBody"
                },
                "push": {
                    "title": "kNotiEventPushTitle",
                    "body": "kNotiEventPushBody"
                },
                "message": {
                    "title": "kNotiEventMessageTitle",
                    "body": "kNotiEventMessageBody"
                }
            }
        },
        "emergency": {
            "key": "emergency",
            "isStored": false,
            "isOption": false,
            "boxTitle": "kNotiEmergencyTitle",
            "boxBody": "kNotiEmergencyBody",
            "sendTypes": {
                "email": {
                    "title": "kNotiEmergencyEmailTitle",
                    "body": "kNotiEmergencyEmailBody"
                },
                "push": {
                    "title": "kNotiEmergencyPushTitle",
                    "body": "kNotiEmergencyPushBody"
                },
                "message": {
                    "title": "kNotiEmergencyMessageTitle",
                    "body": "kNotiEmergencyMessageBody"
                }
            }
        }
    }
};

module.exports = notifications;