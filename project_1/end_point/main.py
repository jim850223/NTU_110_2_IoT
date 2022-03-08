from flask import Flask,jsonify,request,render_template
from flask_cors import CORS
import requests
import time
import base64


app = Flask(__name__)
CORS(app)


stores = [{
    'name': 'My Store',
    'items': [{'name':'my item', 'price': 15.99 }]
}]


def shoot_photo():
  #裡面包送圖片功能
  return

def get_sign():
  return
  

#測試server回覆之用
@app.route('/device/1/commands')
def return_command():
  my_data = {
  "code": 0,
  "message": "success",
  "commands": [
    {
      "userId": "r10525103",
      "action": "openDoor",
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
  photo_to_encode = open("./Rz.jpg", "rb").read()
  photo_base64 = base64.b64encode(photo_to_encode)
  print(photo_base64)
  
  my_data = {
    "deviceId": "1",
    "type": "bell",
    "photo": "./Rz.jpg",
    "userId": "r10525114"
    }
  #r = requests.post('http://後端server', data = my_data)
  r = {'code': 0, 'message': 'success'}
  return r
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
def open_door():  
  return
""" 
@app.route('/package')
def sign_package():
  shoot_photo()
  get_sign()
  return """



def get_products():
    response = requests.get("http://localhost:3000/products")
    print(response.json())



@app.route('/')
def home():
  return render_template('index.html')

#post /store data: {name :}
@app.route('/store' , methods=['POST'])
def create_store():
  request_data = request.get_json()
  new_store = {
    'name':request_data['name'],
    'items':[]
  }
  stores.append(new_store)
  return jsonify(new_store)
  #pass

#get /store/<name> data: {name :}
@app.route('/store/<string:name>')
def get_store(name):
  for store in stores:
    if store['name'] == name:
          return jsonify(store)
  return jsonify ({'message': 'store not found'})
  #pass

va = 16

#get /store
@app.route('/store')
def get_stores():
  print('You can print something there while calling the api')
  get_products()
  
  return jsonify({'stores': stores})
  
  #pass

#post /store/<name> data: {name :}
@app.route('/store/<string:name>/item' , methods=['POST'])
def create_item_in_store(name):
  request_data = request.get_json()
  for store in stores:
    if store['name'] == name:
        new_item = {
            'name': request_data['name'],
            'price': request_data['price']
        }
        store['items'].append(new_item)
        return jsonify(new_item)
  return jsonify ({'message' :'store not found'})
  #pass

#get /store/<name>/item data: {name :}
@app.route('/store/<string:name>/item')
def get_item_in_store(name):
  for store in stores:
    if store['name'] == name:
        return jsonify( {'items':store['items'] } )
  return jsonify ({'message':'store not found'})

  #pass

##app.run(port=5000, ssl_context ='adhoc')
app.run(port=5000)
