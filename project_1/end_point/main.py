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
  #for deg in degrees:
   # switch2deg(deg)
   # time.sleep(0.5)
  #pwm.stop()
  #GPIO.cleanup()




def get_sign():
  return


@app.route('/open_door')
def door():
  #for deg in degrees:
   # switch2deg(deg)
    #time.sleep(0.5)
  #pwm.stop()
  #GPIO.cleanup()
  return 'Rpi has opend the door'


@app.route('/bell')
def notify_the_bell():
  #做post,傳照片
  #shoot_photo()
  photo_to_encode = open("./local_photo/guest.jpg", "rb").read()
  photo_base64 = base64.b64encode(photo_to_encode)
  photo_str = str(photo_base64.decode("UTF-8"))
  #base64的資料型態為byte，需要轉換為str才能放在json中
  #後面decode部分是要解決預設編碼b64的編碼會話前綴b'，用需用decode把他拔掉

  #print(photo_str)
  my_data = {'deviceId': 1, 'type': 'bell', 'photo': photo_str, 'userId': '1'}    
  my_data_json = json.dumps(my_data) 
    
  r = requests.post('http://127.0.0.1:3000/api/notify', data = my_data_json, headers = {"Content-Type":"application/json;charset=UTF-8"})
  #必加入header，否則會一直失敗
  print(r.json())
  
  #r = requests.post('http://127.0.0.1:3000/api/notify', json = my_data)
  #以上兩種寫法都可以，若用data = ，必須要包含header才會被判定為json，若用json=，則不需要轉檔案即可丟出。且在json=的狀態下，不能放json檔，一定要放非json的檔案，讓程式幫你自動轉換
  
  print(r.json())
  return 'belling'
  

@app.route('/package')
def sign_package():
  #shoot_photo()
  photo_to_encode = open("./local_photo/guest.jpg", "rb").read()
  photo_base64 = base64.b64encode(photo_to_encode)
  photo_str = str(photo_base64.decode("UTF-8"))

  my_data = {'deviceId': 1, 'type': 'recivePackage', 'photo': photo_str, 'userId': '1'}    
  #my_data_json = json.dumps(my_data) 
  print(my_data)
    
  #r = requests.post('http://127.0.0.1:3000/api/notify', data = my_data_json, headers = {"Content-Type":"application/json;charset=UTF-8"})
  #必加入header，否則會一直失敗
  #print(r.json())
  
  r = requests.post('http://127.0.0.1:3000/api/notify', json = my_data)
  #以上兩種寫法都可以，若用data = ，必須要包含header才會被判定為json，若用json=，則不需要轉檔案即可丟出。且在json=的狀態下，不能放json檔，一定要放非json的檔案，讓程式幫你自動轉換
  
  print(r.json())
  return 'calling for package'



##app.run(port=5000, ssl_context ='adhoc')
app.run(port=5000)
