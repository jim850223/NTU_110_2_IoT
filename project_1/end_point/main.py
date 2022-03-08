from flask import Flask,jsonify,request,render_template
from flask_cors import CORS
import requests
import time

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
  

@app.route('/bell')
def ring_the_bell():
  shoot_photo()
  return

@app.route('/door')
def ask_open_door():
  shoot_photo()
  return

@app.route('/package')
def sign_package():
  shoot_photo()
  get_sign()
  return



def get_products():
    response = requests.get("http://localhost:3000/products")
    print(response.json())





i = 1
while (i < 3):
  print(i)
  i += 1
  time.sleep(0.5)
#You will never escape from above loop if you don't make the condition fail

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
