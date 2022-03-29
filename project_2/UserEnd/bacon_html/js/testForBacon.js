//0 stands for login state, 1 stands for online, 2 stands for  offline
var piStatus = [];


async function getIpAPI() {
  await fetch('http://127.0.0.1:8080/api/v1/test', { method: "GET" })
    .then(result => {
      console.log(result);      
    })        
}


async function getIps() {
  return fetch("../finalIpList.txt")
    .then(response => {
      return response.text()
    })
    .then(onScreen => {
      return onScreen.split("\n")
    }).then(split_text => {
      return split_text
    })
}

async function printArrayContents(result) {
  for (let i = 0; i < result.length; i++) {
    console.log(`I've got the ip ${result[i]}`)
  }
}

async function transferIpToRequestUrl(ips) {
  let request = [];
  //let request = new Array(3)
  //http://192.168.22.49:80/info 
  for (let i = 0; i < ips.length - 1; i++) {
    request[i] = `http://${ips[i]}:80/info`
    console.log(request[i])
  }
  return request;
}


async function getHttpResult(requestUrls) {
  let httpResponse = [];
  let count = 1  
  for (let i = 0; i < requestUrls.length; i++) 
  try {{        
    piStatus[i] = 0;
    console.log(piStatus[i])
    httpResponse[i] = await fetch(requestUrls[i], { method: 'GET' })
      .then(res => {
        return res.json();
      }).then(res => {
        table.innerHTML += `<tr>
        <th scope="row">${count}</th>
        <td>${res.id}</td>
        <td>${res.ip}</td>
        <td id = wet_${i+1}>${res.wet}</td>
        <td id = temp_${i+1}>${res.temp}</td>
        <td id = appVer_${i+1}>${res.appVer}</td>
        <td id = configVer_${i+1}>${res.configVer}</td>
        <td id = time_${i+1}>${res.time}</td>        
        <td id = status_${i+1}>上線</td>        
        </tr>`
        piStatus[i] = 1;
        console.log(piStatus[i])
        count++;
      });}
  }catch (error) {     
    console.log(`still something goes wrong, throw error to show page: ${error}`);
  }
  return httpResponse;
}



async function printRequest() {
  let test = await getIpAPI();  
  let ips = await getIps();
  let transferRequest = await transferIpToRequestUrl(ips);
  let result = await getHttpResult(transferRequest);
  setInterval(()=>{
    refreshInfo(transferRequest)
  }, 1000)
}





async function refreshInfo(requestUrls) {     
  let count = 1  
  let httpResponse = [];
  for (let i = 0; i < requestUrls.length; i++) 
  try {{
    httpResponse[i] = await fetch(requestUrls[i], { method: 'GET' })
      .then(res => {
        return res.json();
      }).then(res => {
        document.getElementById(`wet_${i+1}`).innerHTML = `${res.wet}`;
        document.getElementById(`temp_${i+1}`).innerHTML = `${res.temp}`;
        document.getElementById(`appVer_${i+1}`).innerHTML = `${res.appVer}`;
        document.getElementById(`configVer_${i+1}`).innerHTML = `${res.configVer}`;        
        document.getElementById(`time_${i+1}`).innerHTML = `${res.time}`;
        document.getElementById(`status_${i+1}`).innerHTML = `上線`;
        count++;
      });}
  }catch (error) {     
    document.getElementById(`wet_${i+1}`).innerHTML = `斷線`;
    document.getElementById(`temp_${i+1}`).innerHTML = `斷線`;
    document.getElementById(`status_${i+1}`).innerHTML = `斷線`;
    piStatus[i] = 2;
    console.log(`still something goes wrong, throw error to show page: ${error}`);
  }  
}

async function askForDetect() {
  table.innerHTML ='';
  let test = await getIpAPI();  
  let ips = await getIps();
  let transferRequest = await transferIpToRequestUrl(ips);
  let result = await getHttpResult(transferRequest);  
}

printRequest();



/* 
var _notifys = [];

$(document).ready(function (c) {
  let table = document.getElementById('table');
  let ips = getIps();

  //Use ips to create http request combinations


  for (let i = 0; i < logs.length; i++) {
    let event = '按電鈴';
    if (logs[i].event == 'bell')
      event = '簽收包裹請求';
    table.innerHTML += `<tr>
    <th scope="row">${i + 1}</th>
    <td>${logs[i].time}</td>
    <td>${event}</td>
    <td><img src="/${logs[i].url}" style="width:100%;height:100%;max-width:15rem"></img></td>
  </tr>`;
  }
}) */
