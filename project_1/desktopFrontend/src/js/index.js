var _notifys = [];

$(document).ready(function(c) {
  var notifyConfig = {
    body: '\\ ^o^ /', // 設定內容
    icon: '/images/favicon.ico', // 設定 icon
  };
  Notification.requestPermission().then(function(permission) { console.log('permiss', permission)});
  if (Notification.permission === 'default' || Notification.permission === 'undefined') {
    Notification.requestPermission(function(permission) {
      if (permission === 'granted') {
        // 使用者同意授權
        var notification = new Notification('Hi there!', notifyConfig); // 建立通知
      }
    });
  }

  let sel_msg = document.getElementById('sel_msg');
  let btn_sendMsg = document.getElementById('btn_sendMsg');
  let btn_opendoor = document.getElementById('btn_opendoor');
  let btn_recivePackage = document.getElementById('btn_recivePackage');
  let photo = document.getElementById('photo');
  let timeLabel = document.getElementById('timeLabel');
  let msg = document.getElementById('msg');
  btn_sendMsg.onclick = (e)=>{
    let selText = sel_msg.options[sel_msg.selectedIndex].text;
    let ret = sendMessage(selText);
  }
  btn_opendoor.onclick = openDoor;



  //檢查notify
  let intervalID = setInterval(()=>{
    let notifys = getNotify();
    while(notifys.length > 0){
      let notify = notifys.pop();
      switch(notify.type){
        case 'bell':
          photo.src = `/${notify.url}`;
          timeLabel.innerText = notify.timestamp
          msg.innerHTML = `<div class="alert alert-primary" role="alert" >
          ${"開門請求"}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          `;
          break;
        case 'recivePackage':
          photo.src = `/${notify.url}`;
          timeLabel.innerText = notify.timestamp
          btn_recivePackage.disabled = false;
          msg.innerHTML = `<div class="alert alert-primary" role="alert" >
          ${"包裹簽收請求"}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          `;
          break;
      }
      _notifys.push(notify);

    }
  }, 500);

})


