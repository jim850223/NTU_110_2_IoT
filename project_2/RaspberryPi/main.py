#coding:utf-8
from flask import Flask, render_template, request, jsonify
import configparser
import socket
from datetime import datetime
import uuid

#OS = 'PI'
OS = 'WIN'
_wet = 25
_temp = 31

if(OS == 'PI'):
	import RPi.GPIO as GPIO
	import Adafruit_DHT

app = Flask(__name__)

config_fileNmae = 'app.ini'
config = configparser.ConfigParser()

@app.route('/')
def index():
	return render_template('index.html')
@app.route('/startup')
def startup():
	return render_template('startup.html')

@app.route('/data/AM2302')
def test():
	wet = 30
	temp = 27
	if(OS == 'PI'):
		data = Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, 4)
		wet = data[0]
		temp = data[1]
	unit = getConfig('public', 'unit')
	global _wet
	global _temp
	global _unit
	
	if unit == '1':
		_temp = temp * 9 / 5 + 32
		_unit = "°F"
	else:
		_wet = wet
		_temp = temp
		_unit = "°C"
		
	return "[{wet:.2f}, {temp:.2f}, \"{0}\"]".format(_unit, wet=_wet, temp=_temp )

@app.route('/config/<section>/<key>', methods=['GET'])
def getConfig(section, key):
	config.read(config_fileNmae)
	return config.get(section, key, fallback='')

@app.route('/config', methods=['POST'])
def setConfig():
	config.read(config_fileNmae)

	for section in request.json.keys():
		for key in request.json[section].keys():
			config.set(section, key, request.json[section][key])
	
	with open(config_fileNmae, 'w') as configfile:
		config.write(configfile)
	return request.json

@app.route('/version', methods=['GET'])
def getVersion():
	config.read('version.ini')
	
	return "[\"{0}\", \"{1}\"]".format(config["version"]["firmware"], config["version"]["config"] )

@app.route('/version/add', methods=['GET'])
def addVersion():
	config.read('version.ini')
	oldVer = int(config["version"]["config"])
	config.set("version", "config", str(oldVer + 1) )
	with open('version.ini', 'w') as configfile:
		config.write(configfile)
	return "{}".format(oldVer)

@app.route('/info', methods=['GET'])
def getInfo():
	global _wet
	global _temp
	if _wet == 25:
		test()    
	config.read("version.ini")
	id = _uuid
	configVer = config['version']['config']
	appVer = config['version']['firmware']

	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("8.8.8.8", 80))
	ip = str(s.getsockname()[0])
	s.close()

	now = datetime.now()
	current_time = now.strftime("%H:%M:%S")
	
	ret = {
		"id": id,
		"ip": ip,
		"name": "LANT",
		"configVer": configVer,
		"appVer": appVer,
		"time": current_time,
		"wet": _wet,
		"temp": _temp,
		"devices": ['AM2302']
	}
	return jsonify(ret) 

def getUUID():
	uuid_ori = uuid.uuid4() 
	uuid_int = str(uuid_ori.int) 
	chkCode = (int(uuid_int[0:2]) + int(uuid_int[-2:])) % 23 
	return "{0}-{1}".format(uuid_ori, chkCode) 

_uuid = getUUID()

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80, debug=True)
