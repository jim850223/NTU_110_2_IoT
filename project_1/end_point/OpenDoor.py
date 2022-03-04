import RPi.GPIO as GPIO
import time

class OpenDoor:
    def __init__(self):
        self.button_event = 'none'
        self.VERIFY_GPIO   = 24
        self.LOCK_GPIO     = 16
        self.DOORBELL_GPIO = 25
    
    def InitializeGPIO(self):
        #initialize GPIO
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        #initialize input PIN
        GPIO.setup(self.LOCK_GPIO, GPIO.OUT, initial=GPIO.LOW)
        #initialize output PIN
        GPIO.setup(self.DOORBELL_GPIO, GPIO.IN, pull_up_down = GPIO.PUD_UP) 
        GPIO.setup(self.VERIFY_GPIO, GPIO.IN, pull_up_down = GPIO.PUD_UP)
        #Add event , execute callback function when detect the event 
        GPIO.add_event_detect(self.DOORBELL_GPIO, GPIO.FALLING, callback=self.doorbell_callback, bouncetime=500)
        GPIO.add_event_detect(self.VERIFY_GPIO, GPIO.FALLING, callback=self.verify_callback, bouncetime=500)

    def doorbell_callback(self, channel):
        print('Doorbell Pressed')
        time.sleep(0.1) # avoid detected twice
        self.button_event = 'door_bell'
        #remove and re-define the detect-event to avoid detected again
        GPIO.remove_event_detect(self.DOORBELL_GPIO)
        GPIO.add_event_detect(self.DOORBELL_GPIO, GPIO.FALLING, callback=self.doorbell_callback, bouncetime=500)
        time.sleep(0.1) # avoid detected twice

    def verify_callback(self, channel):
        print('Verify button Pressed')
        time.sleep(0.1) # avoid detected twice
        self.button_event = 'verify_button'
        #remove and re-define the detect-event to avoid detected again 
        GPIO.remove_event_detect(self.VERIFY_GPIO) 
        GPIO.add_event_detect(self.VERIFY_GPIO, GPIO.FALLING, callback=self.verify_callback, bouncetime=500)
        time.sleep(0.1) # avoid detected twice
      
    def open_door(self, lock_time, result):
        if result:
            print('Door OPEN')
            #self.result = False
            # Output high to open the lock
            GPIO.remove_event_detect(self.DOORBELL_GPIO)
            GPIO.remove_event_detect(self.VERIFY_GPIO)
            GPIO.output(self.LOCK_GPIO, GPIO.HIGH)
            #wait and close the lock
            time.sleep(lock_time)
            GPIO.output(self.LOCK_GPIO, GPIO.LOW)
            GPIO.add_event_detect(self.DOORBELL_GPIO, GPIO.FALLING, callback=self.doorbell_callback, bouncetime=500)
            GPIO.add_event_detect(self.VERIFY_GPIO, GPIO.FALLING, callback=self.verify_callback, bouncetime=500)
            return False
        else: 
            pass
    def get_button_event(self):
        return self.button_event

    def reset_button_event(self):
        self.button_event = 'none'
    
    def event_from_rpi(self):
        event = 'none'
        if self.get_button_event() == 'door_bell':
            event = 'door_bell'
            self.reset_button_event()
        
        elif self.get_button_event() == 'verify_button':
            event = 'verify_button'
            self.reset_button_event()
        else:
            event = 'pass'
        return event
