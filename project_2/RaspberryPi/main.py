#import RPi.GPIO as GPIO
#import Adafruit_DHT
from flask import Flask, render_template, request
import configparser


app = Flask(__name__)

config_fileNmae = 'config.ini'
config = configparser.ConfigParser()

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/data/AM2302')
def test():
	# return str(Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, 4))
	return str([20, 42])

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

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80, debug=True)
