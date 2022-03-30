$(function(){
    //更新時間
    setInterval(()=>{
        let now = new Date();
        let dateStringWithTime = moment(now).format('HH:mm:ss');
        let timeElm = document.getElementById("time");
        timeElm.innerText = dateStringWithTime;
        UpdateVersion();
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
            let unit = response[2];
            let temperatureElm = document.getElementById("temperature");
            let wetElm = document.getElementById("wet");

            temperatureElm.innerText = `室內溫度: ${temp}${unit}`;
            wetElm.innerText = `室內濕度: ${wet}%`;
        }
    };     
}

function UpdateVersion() {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/version", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            let f_ver = response[0];
            let ini_ver = response[1];
            let f_verElm = document.getElementById("f_ver");
            let ini_verElm = document.getElementById("ini_ver");

            f_verElm.innerText = `韌體版本: ${f_ver}`;
            ini_verElm.innerText = `組態版本: ${ini_ver}`;
        }
    };     
}