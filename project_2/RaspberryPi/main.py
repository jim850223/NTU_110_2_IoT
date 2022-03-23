#import RPi.GPIO as GPIO
#import Adafruit_DHT
from flask import Flask, render_template, request



app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/data/AM2302')
def test():
	return str(Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, 4))



if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80, debug=True)
