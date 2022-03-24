from flask import Flask, render_template, request
import configparser

#OS = 'PI'
OS = 'WIN'

if(OS == 'PI'):
	import RPi.GPIO as GPIO
	import Adafruit_DHT

app = Flask(__name__)

config_fileNmae = 'config.ini'
config = configparser.ConfigParser()

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/data/AM2302')
def test():
	wet = 30
	temp = 27
	if(OS == 'PI'):
		data = Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, 4)
		return "[{wet:.2f}, {temp:.2f}]".format(wet=wet, temp=temp)
	return str([wet, temp])

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
