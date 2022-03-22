import RPi.GPIO as GPIO
from flask import Flask, render_template, request
import Adafruit_DHT



app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/data/AM2302')
def test():
	return str(Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, 4))

@app.route(''):
def page():
	return 's'

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80, debug=True)
