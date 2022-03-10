var _notifys = [];

$(document).ready(function(c) {
  let table = document.getElementById('table');
  let logs = getVoiceMsgLogs();

  for(let i=0; i<logs.length; i++){
    table.innerHTML += `<tr>
    <th scope="row">${i+1}</th>
    <td>${logs[i].time}</td>
    <td><audio controls>
    <source src="/${logs[i].voice_url}" type="audio/mpeg">
    Your browser does not support this audio format.
  </audio></td>
    <td><img src="/${logs[i].photo_url}" style="width:100%;height:100%;max-width:15rem"></img></td>
  </tr>`;
  }
  
})


