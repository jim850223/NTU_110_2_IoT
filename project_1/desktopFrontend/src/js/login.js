$(document).ready(function(c) {
    let token = getCookie('token');

    let form = document.getElementById('loginForm');
    let msg = document.getElementById('msg');
    form.onsubmit = function(event){
        debugger
        let formData = formDataToJson(form);
        let res = login(formData);
        msg.innerText = "";
        if(res.status === 0){
            window.location.assign('/html/index.html'); //跳回首頁
        }else{
            msg.innerText = "帳號或密碼錯誤";
        }
        return false;
    }
})