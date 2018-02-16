export default function calendar() {
    "ngInject";

    return {
        restrict: "A",
        require: 'ngModel',
        scope: {
            currentDate: '=ngModel',
            startDate: '=startDate',
            endDate: '=endDate',
        },
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                format: 'yyyy-mm-dd',
                startDate: new Date(),
                endDate: scope.endDate,
                language: 'kr',
                autoclose: true,
                inline: false
            });
        }
    }

}