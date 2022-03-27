const config = {
    temperatureUnit: 1
};

$(function(){
    //更新時間
    setInterval(()=>{
        let now = new Date();
        let dateStringWithTime = moment(now).format('HH:mm:ss');
        let timeElm = document.getElementById("time");
        timeElm.innerText = dateStringWithTime;
        GetTempAndWet();
    }, 1000);
});

function GetTempAndWet() {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/data/AM2302", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            let wet = response[0];
            let temp = response[1];

            let temperatureElm = document.getElementById("temperature");
            let wetElm = document.getElementById("wet");

            if(config['temperatureUnit'] == '1')
                temperatureElm.innerText = `室內溫度: ${temp}°C`;
            else
                temperatureElm.innerText = `室內溫度: ${temp * 9 / 5 + 32}°F`;
            wetElm.innerText = `室內濕度: ${wet}%`;
        }
    };     
}