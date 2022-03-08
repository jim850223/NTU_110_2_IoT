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
  btn_sendMsg.onclick = (e)=>{
    let selText = sel_msg.options[sel_msg.selectedIndex].text;
    let ret = sendMessage(selText);
    debugger;
  }
})


