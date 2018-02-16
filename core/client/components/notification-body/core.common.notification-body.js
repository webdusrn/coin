export default function notificationBody(metaManager) {
    "ngInject";

    return function (notificationBox, language) {

        var LANGUAGES = metaManager.langs;
        var NOTIFICATIONS = metaManager.notifications;
        var NOTIFICATIONS_PUBLIC = metaManager.notifications.public;
        var notificationBoxBody;
        var result = '';

        if (NOTIFICATIONS[notificationBox.key]) {
            notificationBoxBody = NOTIFICATIONS[notificationBox.key].boxBody;
        } else if (NOTIFICATIONS_PUBLIC[notificationBox.key]) {
            notificationBoxBody = NOTIFICATIONS_PUBLIC[notificationBox.key].boxBody;
        } else {
            return result;
        }

        if (LANGUAGES.hasOwnProperty(language)) {
            var localLanguage = LANGUAGES[language];

            if (localLanguage.hasOwnProperty(notificationBoxBody)) {

                result = localLanguage[notificationBoxBody];

                for (var key in notificationBox.payload) {
                    if (notificationBox.payload.hasOwnProperty(key)) {
                        result = result.replace(':' + key + ':', "'" + notificationBox.payload[key] + "'");
                    }
                }
            }
        }

        return result;
    };
}