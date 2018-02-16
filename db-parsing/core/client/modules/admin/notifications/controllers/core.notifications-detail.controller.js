export default function NotificationsDetailCtrl($scope, $filter, $interval, $uibModalInstance, scope, massNotification, metaManager) {
    "ngInject";

    $scope.massNotification = massNotification;
    $scope.NOTIFICATION = metaManager.std.notification;

    $scope.cancel = cancel;

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}