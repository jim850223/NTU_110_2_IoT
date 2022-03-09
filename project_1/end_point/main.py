from flask import Flask,jsonify,request,render_template
from flask_cors import CORS
import requests
import time
import base64
import json
#from picamera import PiCamera
#import RPi.GPIO as GPIO

app = Flask(__name__)
CORS(app)

""" PWM_FREQ = 50
degrees = [45, 90, 135, 90]
LOCK_GPIO = 23
GPIO.setup(LOCK_GPIO, GPIO.OUT)
pwm = GPIO.PWM(LOCK_GPIO, PWM_FREQ)
pwm.start(0) """
def angle_to_duty_cycle(angle=0):
    duty_cycle = (0.05 * PWM_FREQ) + (0.19 * PWM_FREQ * angle / 180)
    return duty_cycle

def switch2deg(deg):
    dc = angle_to_duty_cycle(deg)
    pwm.ChangeDutyCycle(dc)

def shoot_photo():
  #裡面包送圖片功能
  count = 0
  print("Button pressed")
  # Photo
  camera = PiCamera()
  camera.resolution = (640,480)
  camera.vflip = True
  camera.start_preview()
  time.sleep(1)
  camera.capture('./local_photo/'+'guest.jpg')
  camera.close()
  return

def open_door():
  print("Door opened")
  for deg in degrees:
    switch2deg(deg)
    time.sleep(0.5)
  pwm.stop()
  GPIO.cleanup()


def get_sign():
  return


  

#測試server回覆之用
@app.route('/device/1/commands')
def return_command():
  my_data = {
  "code": 0,
  "message": "不急，等等到家",
  "commands": [
    {
      "userId": "r10525103",
      "action": "setMessage",
      "parameters": {},
      "timestamp": "2022-03-08T03:23:54.855Z"
    }
  ]
}
  #r = requests.post('http://後端server', data = my_data)
  #r = {'code': 0, 'message': 'success'}
  return jsonify (my_data)
  #return jsonify ({'code': 0, 'message': 'success'})

@app.route('/bell')
def ring_the_bell():
  #做post,傳照片

  #shoot_photo()
  photo_to_encode = open("./local_photo/guest.jpg", "rb").read()
  photo_base64 = base64.b64encode(photo_to_encode)

  #my_data = {'deviceId': 1, 'type': 'bell', 'photo': photo_base64, 'userId': 'r10525114'}
  my_data = {'deviceId': 1, 'type': 'bell', 'userId': 'r10525114'}
  #base64的資料型態為byte，包含在json檔中，故若要轉檔會一直失敗
  
  print(type(photo_base64))
  #my_data = {'id': 1, 'name': 'ram sharma'}
  print(type(my_data))
  j = json.dumps(my_data)
  print(type(j))
  #r = requests.post('http://127.0.0.1:3000/api/notify', json = my_data)
  #print(r)
  print(66666666666666)
  return 'ok'
  #return jsonify ({'code': 0, 'message': 'success'})

@app.route('/package')
def sign_package():
  shoot_photo()
  my_data = {
    "deviceId": "1",
    "type": "receivePackage",
    "photo": "./Rz.jpg",
    "userId": "r10525114"
    }
  get_sign()
  return jsonify ({'code': 0, 'message': 'success'})

  

@app.route('/door')
def door():  
  return
""" 
@app.route('/package')
def sign_package():
  shoot_photo()
  get_sign()
  return """





##app.run(port=5000, ssl_context ='adhoc')
app.run(port=5000)
