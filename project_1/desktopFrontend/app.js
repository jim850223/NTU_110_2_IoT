//server
const express = require('express');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const port = 3000;
var cors = require('cors')
app.use(cors())


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
const cors = require('cors')


//////////////////////////////////////////////////////////////////
_commandMap = new Map(); // <device id, command[]>
_notifyMap = new Map(); // <user id, notify[]>
_voiceMsgMap = new Map(); // <user id, msg[]>
//////////////////////////////////////////////////////////////////
app.use('/', express.static('src'));
app.use('/data', express.static('data'));
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
    '/index2.html',
    '/login.html',
    '/test.html',
    {url: '/api/notify', methods: ['POST']},
    {url: '/api/voiceMsg', methods: ['POST']},
    {url: /^\/api\/device\/.*\/commands/, methods: ['GET']},
    {url: /^\/api\/images\/.*/, methods: ['GET']},
    {url: /^\/web\/.*/, methods: ['GET']},
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
function QQ2(text){
  // 容錯率 L &lt; M &lt; Q &lt; H
  const opts = {
    errorCorrectionLevel: 'H',
    version: 2
  };
  const path = 'qrcode.png';
  QRCode.toFile(path, text, opts, (err)=>{
    if (err) throw err;
    console.log('saved.');
  });
}

//////////////////////////////////////////////////////////////////
app.post('/api/user/login', (req, res) => {
  let statusCode = -1;
  let message = '';
  let data = {};
  try{
    let account = req.body.account;
    let pwd = req.body.password;
    //check parameters
    if(!chkPar(account) || !chkPar(pwd))
      throw '請輸入帳號和密碼'

    //check user
    let sha256_pwd = sha256(pwd + sha_salt);
    //let userInfo = db.signIn(req.body.email, sha256_pwd);

    let userInfo = {
      "id": account,
      "password": sha256_pwd,
      "level": 0
    }
    if(userInfo){
      // create token
      const token = 'Bearer ' + jwt.sign({
        "id": userInfo.id,
        "password": sha256_pwd,
        "level": userInfo.type
      }, jwt_secret, {expiresIn: 3600 * 24 * 1});
      data["id"] = userInfo.id;
      data["token"] = token;
      statusCode = 200;
      message = "Login success";
    }else{
      statusCode = 401;
      message = "Unknown e-mail or bad password";
    }
  }catch(e){
    statusCode = 400;
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(statusCode).json(res_json);
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
    let deviceId = req.params.id;
    let action = req.body.action;
    let parameters = req.body.parameters;

    let m = new Date();
    let now = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();

    //加入資料到佇列
    if(!_commandMap.has(deviceId)){
      _commandMap.set(deviceId, []);
    }
    _commandMap.get(deviceId).push({
      "userId": deviceId,
      "action": action,
      "parameters": parameters,
      "timestamp": now,
    });

    statusCode = 0;
  }catch(e){
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
    let userId = req.user.id;
    if(_notifyMap.has(userId)){
      let notifys = _notifyMap.get(userId);
      while(notifys.length > 0)
        data.push(notifys.pop());
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
    let deviceId = req.body.deviceId;
    let notifyType = req.body.type;
    let userId = req.body.userId;
    let photo = req.body.photo;

    let m = new Date();
    let now = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
   
    //儲存檔案
    let photo_fileName = `data/${Date.now()}.jpg`;
    let savePhoto_ok = dataURLtoFile(photo, photo_fileName);
    if(!savePhoto_ok)
      throw '照片上傳失敗';
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
    let userId = req.user.id;
    if(_voiceMsgMap.has(userId)){
      data = _voiceMsgMap.get(userId);
    }
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
    let deviceId = req.body.deviceId;
    let userId = req.body.userId;
    let photo = req.body.photo;
    let voice = req.body.voice;

    let m = new Date();
    let now = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
   
    //儲存檔案
    let photo_fileName = `data/${Date.now()}.jpg`;
    let savePhoto_ok = dataURLtoFile(photo, photo_fileName);
    if(!savePhoto_ok)
      throw '照片上傳失敗';
    let voice_fileName = `data/${Date.now()}.mp3`;
    let saveVoice_ok = dataURLtoFile(voice, voice_fileName);
    if(!saveVoice_ok)
      throw '聲音上傳失敗';

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

    statusCode = 0;
  }catch(e){
    message = e.message;
  }
  let res_json = createResponseJson(statusCode, message, data);
  res.status(200).json(res_json);
});

app.listen(port, ()=>console.log('sever run'));