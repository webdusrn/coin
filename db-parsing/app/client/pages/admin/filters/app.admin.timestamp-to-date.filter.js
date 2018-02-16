export default function timestampToDate() {
    "ngInject";

    return function (timestamp, type) {

        if(timestamp == undefined || timestamp == null || timestamp == 0){
            return "noDate";
        }

        var a = new Date(timestamp);
        var year = a.getFullYear();
        var month = a.getMonth()+1;
        if(month < 10){
            month = "0"+month;
        }

        var date = a.getDate();
        if(date < 10){
            date = "0"+date;
        }


        var hour = a.getHours();
        if(hour < 10){
            hour = "0"+hour;
        }

        var min = a.getMinutes();
        if(min < 10){
            min = "0"+min;
        }

        var sec = a.getSeconds();

        var time = year + '-' + month + '-' + date ;

        if(type == "time"){
            time += " "+hour+":"+min;
        }
        else{

        }

        return time;
    };
}