$(document).ready(function(c) {
    let token = getCookie('token');

    let form = document.getElementById('loginForm');
    form.onsubmit = function(event){
        debugger
        let formData = formDataToJson(form);
        let res = login(formData);
        
        if(res.status === 200){
    
            window.location.assign('/html/index2.html'); //跳回首頁
        }else{
        
        }
        return false;
    }
})