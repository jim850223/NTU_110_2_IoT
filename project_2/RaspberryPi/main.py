from flask import Flask, render_template, request, jsonify
import configparser
import socket
from datetime import datetime

#OS = 'PI'
OS = 'WIN'

_wet = 25
_temp = 31

if(OS == 'PI'):
	import RPi.GPIO as GPIO
	import Adafruit_DHT

app = Flask(__name__)

config_fileNmae = 'config.ini'
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
	unit = getConfig('PUBLIC', 'name')
	_wet = wet
	_temp = temp
	# 轉華氏
	if unit == 1:
		_temp = _temp * 9 / 5 + 32
	return "[{wet:.2f}, {temp:.2f}]".format(wet=wet, temp=temp)

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

@app.route('/info', methods=['GET'])
def getInfo():
	id = "000105"
	configVer = "2"
	appVer = "1.1"

	# 取得IP
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("8.8.8.8", 80))
	ip = str(s.getsockname()[0])
	s.close()

	now = datetime.now()
	current_time = now.strftime("%H:%M:%S")

	ret = {
		"id": id,
		"ip": ip,
		"configVer": configVer,
		"appVer": appVer,
		"time": current_time,
		"wet": _wet,
		"temp": _temp
	}
	return jsonify(ret) 


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80, debug=True)
