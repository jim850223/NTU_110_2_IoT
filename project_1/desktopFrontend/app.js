//server
const express = require('express');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const port = 3000;

//jwt
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken')
const jwt_secret = 'R10525114';

//sha256
const sha256 = require('js-sha256').sha256;
const sha_salt = 'R10525114';

//db
const db = require('./dbHelper');

//qrcode
const QRCode = require('qrcode');

//
const fs = require('fs'); 
const path = require('path'); 
const cors = require('cors');
const { getVoiceMsgs } = require('./dbHelper');
const { hasUncaughtExceptionCaptureCallback } = require('process');


//////////////////////////////////////////////////////////////////
_commandMap = new Map(); // <device id, command[]>
_notifyMap = new Map(); // <user id, notify[]>
_voiceMsgMap = new Map(); // <user id, msg[]>
//////////////////////////////////////////////////////////////////
app.use('/', express.static('src'));
app.use('/data', express.static('data'));
app.use('/qrcode', express.static('qrcode'));
//////////////////////////////////////////////////////////////////
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());

app.use(expressJwt({
  secret: jwt_secret,
  algorithms: ['HS256']
}).unless({
  path: [
    '/api/user/login',
    '/index.html',
    '/login.html',
    '/test.html',
    {url: '/api/notify', methods: ['POST']},
    {url: '/api/voiceMsg', methods: ['POST']},
    {url: /^\/api\/device\/.*\/commands/, methods: ['GET']},
    {url: /^\/data\/.*/, methods: ['GET']},
    {url: /^\/qrcode\/.*/, methods: ['GET']},
  
  ]  
}))
//////////////////////////////////////////////////////////////////
function createResponseJson(status, message, data){
  return {
    "status": status,
    "message": message,
    "data": data
  };
}
function chkPar(data){
  return !((data == undefined) || (data = null))
}
function dataURLtoFile(base64, filename) {
  let base64Data = base64.replace(/^data:image\/png;base64,/, "");
  let ok = false;
  try{
    require("fs").writeFileSync(filename, base64Data, 'base64');
    ok = true;
  }catch(e){
    console.log(e.message);
  }
  return ok;
}

function QQ(text){
  QRCode.toDataURL(text, (err, url)=>{
    if (err) throw err;
    console.log(url);
  });
}
function QRCODE_SAVE(text, fileName){
  // 容錯率 L &lt; M &lt; Q &lt; H
  const opts = {
    errorCorrectionLevel: 'H',
    version: 2
  };
  QRCode.toFile(fileName, text, opts, (err)=>{
    if (err) throw err;
    console.log('saved.');
  });
}
function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}
//////////////////////////////////////////////////////////////////
app.post('/api/user/login', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = {};
  try{
    let email = req.body.email;
    let pwd = req.body.password;

    //check user
    //let sha256_pwd = sha256(pwd + sha_salt);
    let userInfo = db.signIn(email, pwd);
    userInfo.id = userInfo.id + '';
    if(userInfo){
      // create token
      const token = 'Bearer ' + jwt.sign(userInfo, jwt_secret, {expiresIn: 3600 * 24 * 1});
      data["id"] = userInfo.id;
      data["token"] = token;
      statusCode = 0;
      message = "Login success";
    }else{
      statusCode = 401;
      message = "Unknown account or bad password";
    }
  }catch(e){
    statusCode = 400;
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.get('/api/device/:id/commands', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = [];
  try{
    let deviceId = req.params.id;
    if(_commandMap.has(deviceId)){
      let commands = _commandMap.get(deviceId);
      while(commands.length > 0)
        data.push(commands.pop());
    }
    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.post('/api/device/:id/commands', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = {};
  try{
    let userId = req.user.id;
    let level = req.user.level;
    let deviceId = req.params.id;
    let action = req.body.action;
    let parameters = req.body.parameters;
    if(level != 1)
      throw new UserException("權限不足");

    let m = new Date();
    let now = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();

    //加入資料到佇列
    if(!_commandMap.has(deviceId)){
      _commandMap.set(deviceId, []);
    }
    if(action == 'recivePackage'){
      let qrfileName = `qrcode/${Date.now()}.png`
      QRCODE_SAVE(Date.now()+'',qrfileName);
      parameters = {'url': qrfileName};
    }

    _commandMap.get(deviceId).push({
      "userId": deviceId,
      "action": action,
      "parameters": parameters,
      "timestamp": now,
    });

    statusCode = 0;
  }catch(e){
    console.log(e)

    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.get('/api/notify', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = [];
  try{
    let userId = req.user.id + '';
    if(_notifyMap.has(userId)){
      let notifys = _notifyMap.get(userId);
      while(notifys.length > 0){
        let notify = notifys.pop();
        data.push(notify);
        db.createLog({
          'time': notify.timestamp,
          'event': notify.type,
          'url': notify.url,
          'userId': userId,
          'deviceId': notify.deviceId,
        })
      }
    }
    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.post('/api/notify', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = {};
  try{
    let deviceId = req.body.deviceId + '';
    let notifyType = req.body.type;
    let userId = req.body.userId + '';
    let photo = req.body.photo;

    let m = new Date();
    let now = m.getFullYear() +"/"+ (m.getMonth()+1) +"/"+ m.getDate() + " " + m.getHours() + ":" + m.getMinutes() + ":" + m.getSeconds();
   
    //儲存檔案
    let photo_fileName = `data/${Date.now()}.jpg`;
    let savePhoto_ok = dataURLtoFile(photo, photo_fileName);
    if(!savePhoto_ok)
      throw  new UserException('照片上傳失敗');
    //寫DB

    //加入資料到佇列
    if(!_notifyMap.has(userId)){
      _notifyMap.set(userId, []);
    }
    _notifyMap.get(userId).push({
      "deviceId": deviceId,
      "type": notifyType,
      "url": photo_fileName,
      "timestamp": now,
    });
    if(!_notifyMap.has("2")){
      _notifyMap.set("2", []);
    }
    _notifyMap.get("2").push({
      "deviceId": deviceId,
      "type": notifyType,
      "url": photo_fileName,
      "timestamp": now,
    });

    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.get('/api/voiceMsg', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = [];
  try{
    let userId = req.user.id+'';
    if(_voiceMsgMap.has(userId)){
      let msgs = _voiceMsgMap.get(userId);
      while(msgs.length > 0){
        let msg = msgs.pop();
        data.push(msg);
      }
    }
    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.get('/api/voiceMsgLogs', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = [];
  try{
    let userId = req.user.id + '';
    let msgs = getVoiceMsgs(userId);
    if(msgs)
      data = msgs;
    
    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.post('/api/voiceMsg', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = {};
  try{
    let deviceId = req.body.deviceId+'';
    let userId = req.body.userId;
    let photo = req.body.photo;
    let voice = req.body.voice;

    let m = new Date();
    let now = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
   
    //儲存檔案
    let photo_fileName = `data/${Date.now()}.jpg`;
    let savePhoto_ok = dataURLtoFile(photo, photo_fileName);
    if(!savePhoto_ok)
      throw new UserException('照片上傳失敗');
    let voice_fileName = `data/${Date.now()}.mp3`;
    let saveVoice_ok = dataURLtoFile(voice, voice_fileName);
    if(!saveVoice_ok)
    throw new UserException( '聲音上傳失敗');

    //加入資料到佇列
    if(!_voiceMsgMap.has(userId)){
      _voiceMsgMap.set(userId, []);
    }
    _voiceMsgMap.get(userId).push({
      "deviceId": deviceId,
      "voice_url": photo_fileName,
      "photo_url": voice_fileName,
      "timestamp": now,
    });
    db.createVoiceMsg({
      'time': now,
      'photo_url': photo_fileName,
      'voice_url': voice_fileName,
      'userId': userId,
      'deviceId': deviceId,
    })

    _voiceMsgMap.get('2').push({
      "deviceId": deviceId,
      "voice_url": photo_fileName,
      "photo_url": voice_fileName,
      "timestamp": now,
    });
    db.createVoiceMsg({
      'time': now,
      'photo_url': photo_fileName,
      'voice_url': voice_fileName,
      'userId': '2',
      'deviceId': deviceId,
    })

    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.get('/api/logs', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = [];
  try{
    let userId = req.user.id + '';
    let logs = db.getLogs(userId);
    if(logs)
      data = logs;
    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

//自動創建data資料夾
fs.mkdir(path.join(__dirname, 'data'), (err) => { 
  if (err) { 
      return console.error(err); 
  } 
  console.log('Directory created successfully!'); 
});
fs.mkdir(path.join(__dirname, 'qrcode'), (err) => { 
  if (err) { 
      return console.error(err); 
  } 
  console.log('Directory created successfully!'); 
});

app.listen(port, ()=>console.log('sever run'));