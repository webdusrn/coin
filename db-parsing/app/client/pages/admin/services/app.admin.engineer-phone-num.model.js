EngineerPhoneNum.$inject = ['$resource', 'appResources'];

export default function EngineerPhoneNum($resource, appResources) {
    "ngInject";

    return $resource(appResources.ENGINEER_PHONE_NUMS, {}, {})
}