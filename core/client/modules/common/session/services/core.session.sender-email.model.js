SenderEmail.$inject = ['$resource', 'sessionResources'];

export default function SenderEmail($resource, sessionResources) {
    "ngInject";

    return $resource(sessionResources.SENDER_EMAIL, {}, {});
}