$(function(){
    
    
    //更新時間
    setInterval(()=>{
        let now = new Date();
        let dateStringWithTime = moment(now).format('HH:mm:ss');
        let timeElm = document.getElementById("time");
        timeElm.innerText = dateStringWithTime;
    }, 1000);
});