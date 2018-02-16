timeInit();

function timeInit () {
    var maintenance = window.maintenance;
    if (maintenance.endTime) {
        var endTime = new Date(maintenance.endTime);
        var span = document.getElementById('sg-end-time');
        span.innerHTML = endTime.getFullYear() + '.' + attachZero(endTime.getMonth() + 1) + '.' + attachZero(endTime.getDate()) + ' ' + attachZero(endTime.getHours()) + ':' + attachZero(endTime.getMinutes());
    }
}

function attachZero (data) {
    if (typeof data == "number") {
        if (data < 10 && data >= 0) {
            return '0' + data;
        } else {
            return data;
        }
    } else {
        return null;
    }
}