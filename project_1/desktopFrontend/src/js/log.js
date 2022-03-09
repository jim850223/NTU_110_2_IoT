var _notifys = [];

$(document).ready(function(c) {
  let table = document.getElementById('table');
  let logs = getLogs();

  for(let i=0; i<logs.length; i++){
    let event = '按電鈴';
    if(logs[i].event == 'bell')
      event = '簽收包裹請求';
    table.innerHTML += `<tr>
    <th scope="row">${i+1}</th>
    <td>${logs[i].time}</td>
    <td>${event}</td>
    <td><img src="/${logs[i].url}" style="width:100%;height:100%;max-width:15rem"></img></td>
  </tr>`;
  }
  
})


