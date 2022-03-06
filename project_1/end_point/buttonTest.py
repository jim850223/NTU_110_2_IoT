import RPi.GPIO as GPIO
import time

BUTTON_PIN = 16
LED_PIN = 21

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN)
GPIO.setup(LED_PIN, GPIO.OUT)

while True:
    BUTTON_STATUS = GPIO.input(BUTTON_PIN)
    if (BUTTON_STATUS == True):
        print('3.3')
        GPIO.output(LED_PIN, 1)
    else:
        print('0')
        GPIO.output(LED_PIN, 0)
    