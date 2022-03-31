//0 stands for login state, 1 stands for online, 2 stands for  offline
var piStatus = [];

async function getIpsToFile() {
  await fetch('http://127.0.0.1:8080/api/v1/test', { method: "GET" })
    .then(result => {
      console.log(result);      
    })        
}

async function getIpsFromFile() {
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
    //console.log(request[i])
  }
  return request;
}


async function getHttpResult(requestUrls) {
  let httpResponse = [];
  let count = 1  
  for (let i = 0; i < requestUrls.length; i++) 
  try {{        
    piStatus[i] = 0;    
    httpResponse[i] = await fetch(requestUrls[i], { method: 'GET' })
      .then(res => {
        return res.json();
      }).then(res => {
        table.innerHTML += `<tr>
        <th scope="row">${count}</th>
        <td>${res.id}</td>
        <td>${res.ip}</td>
        <td id = wet_${i}>${res.wet}</td>
        <td id = temp_${i}>${res.temp}</td>
        <td id = appVer_${i}>${res.appVer}</td>
        <td id = configVer_${i}>${res.configVer}</td>
        <td id = time_${i}>${res.time}</td>        
        <td id = status_${i}>上線</td>
        <td id = status_${i}><a class="btn btn-warning" onclick=askForUpdate_${i}() >版本更新</a></td>
        <td id = status_${i}><a class="btn btn-warning" onclick=askForConfig_${i}() >組態更新</a></td>
        <td id = status_${i}><a class="btn btn-warning" onclick=askForReset_${i}() >原廠設定</a></td>        

        </tr>`
        piStatus[i] = 1;
        count++;
      });}
  }catch (error) {     
    console.log(`still something goes wrong, throw error to show page: ${error}`);
  }
  return httpResponse;
}


async function initiateManager() {
  await getIpsToFile();
  let ips = await getIpsFromFile();
  let transferRequest = await transferIpToRequestUrl(ips);
  await getHttpResult(transferRequest);
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
        document.getElementById(`wet_${i}`).innerHTML = `${res.wet}`;
        document.getElementById(`temp_${i}`).innerHTML = `${res.temp}`;
        document.getElementById(`appVer_${i}`).innerHTML = `${res.appVer}`;
        document.getElementById(`configVer_${i}`).innerHTML = `${res.configVer}`;        
        document.getElementById(`time_${i}`).innerHTML = `${res.time}`;
        document.getElementById(`status_${i}`).innerHTML = `上線`;
        count++;
      });}
  }catch (error) {     
    document.getElementById(`wet_${i}`).innerHTML = `斷線`;
    document.getElementById(`temp_${i}`).innerHTML = `斷線`;
    document.getElementById(`status_${i}`).innerHTML = `斷線`;
    piStatus[i] = 2;
    console.log(`still something goes wrong, throw error to show page: ${error}`);
  }  
}

async function askForDetect() {
  table.innerHTML ='';
  await getIpsToFile();
  let ips = await getIpsFromFile();
  let transferRequest = await transferIpToRequestUrl(ips);
  await getHttpResult(transferRequest);  
}

async function askForReset_0() {
  await fetch('http://127.0.0.1:8080/api/v1/reset_0', { method: "GET" })
    .then(result => {
      console.log(result);      
    }) 
}

async function askForReset_1() {
  await fetch('http://127.0.0.1:8080/api/v1/reset_1', { method: "GET" })
    .then(result => {
      console.log(result);      
    }) 
}

async function askForUpdate_0() {
  await fetch('http://127.0.0.1:8080/api/v1/update_0', { method: "GET" })
    .then(result => {
      console.log(result);      
    }) 
}

async function askForUpdate_1() {
  await fetch('http://127.0.0.1:8080/api/v1/update_1', { method: "GET" })
    .then(result => {
      console.log(result);      
    }) 
}

async function askForConfig_0() {
  await fetch('http://127.0.0.1:8080/api/v1/config_0', { method: "GET" })
    .then(result => {
      console.log(result);      
    }) 
}

async function askForConfig_1() {
  await fetch('http://127.0.0.1:8080/api/v1/config_1', { method: "GET" })
    .then(result => {
      console.log(result);      
    }) 
}


initiateManager();