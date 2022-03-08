$(document).ready(function () {
    const backend_path = "http://127.0.0.1:8080/";
    setInterval(postMessage, 1000);
    function postMessage() {
        let msg = "door_status"
        sending_data = { "msg": msg };
        json = JSON.stringify(sending_data);
        $.post(backend_path, json, function (data_from_backend) {
            data = JSON.parse(data_from_backend);
            console.log(data)
            var element = document.getElementById("door_status");
            elemet.innerHTML += "Connected to backend " + data.results;
        })
    }
})