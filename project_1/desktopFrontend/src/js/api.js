function httpGet(url, headers)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); 
    if(headers){
        for(let name in headers)
            xmlHttp.setRequestHeader(name, headers[name]);
    }

    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpPost(url, data, headers)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.withCredentials = true;
    xmlHttp.open( "POST", url, false );
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if(headers){
        for(let name in headers)
            xmlHttp.setRequestHeader(name, headers[name]);
    }
    xmlHttp.send(JSON.stringify(data));
    return xmlHttp.responseText;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function deleteCookie( name, path) {
    if( getCookie( name ) ) {
      document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ((document.domain)?";domain="+document.domain:"") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function formDataToJson(form){
    let data = new FormData(form);
    let object = {};
    data.forEach((value, key) => object[key] = value);
    return object;
}

function getProducts()
{
    let resText = httpGet("../api/products");
    return JSON.parse(resText);
}

function signIn(data)
{
    let resText = httpPost("../api/users/signIn", data);
    let res = JSON.parse(resText);
    setCookie('token', res.data.token, 1);
    return res;
}

function getUserInfo(token)
{
    if(!token) return;
    let resText = httpGet("../api/users/me", {'Authorization': token});
    return JSON.parse(resText);
}

function signUp(data)
{
    let resText = httpPost("../api/users", data);
    let res = JSON.parse(resText);
    setCookie('token', res.data.token, 1);
    return res;
}

function login(data)
{
    let resText = httpPost("/api/user/login", data);
    let res = JSON.parse(resText);
    setCookie('token', res.data.token, 1);
    return res;
}
function sendMessage(message,deviceId)
{
    let data = {
        "action": "setMessage",
        "parameters": {
            "message": message
        }
    };
    let token = getCookie('token');
    let resText = httpPost(`/api/device/${deviceId}/commands`, data, {'Authorization': token});
    let res = JSON.parse(resText);
    return res;
}
function openDoor(deviceId)
{
    let data = {
        "action": "openDoor",
        "parameters": {}
    };
    let token = getCookie('token');
    let resText = httpPost(`/api/device/${deviceId}/commands`, data, {'Authorization': token});
    let res = JSON.parse(resText);
    return res;
}
function recivePackage(deviceId)
{
    let data = {
        "action": "recivePackage",
        "parameters": {}
    };
    let token = getCookie('token');
    let resText = httpPost(`/api/device/${deviceId}/commands`, data, {'Authorization': token});
    let res = JSON.parse(resText);
    return res;
}
function getNotify()
{
    let data = [];
    let token = getCookie('token');
    let resText = httpGet("/api/notify", {'Authorization': token});
    let res = JSON.parse(resText);
    if(Array.isArray(res.data))
        data = res.data;
    return data;
}
function getLogs()
{
    let data = [];
    let token = getCookie('token');
    let resText = httpGet("/api/logs", {'Authorization': token});
    let res = JSON.parse(resText);
    if(Array.isArray(res.data))
        data = res.data;
    return data;
}
function getVoiceMsgLogs()
{
    let data = [];
    let token = getCookie('token');
    let resText = httpGet("/api/voiceMsgLogs", {'Authorization': token});
    let res = JSON.parse(resText);
    if(Array.isArray(res.data))
        data = res.data;
    return data;
}