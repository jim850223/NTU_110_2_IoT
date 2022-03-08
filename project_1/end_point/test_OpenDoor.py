import OpenDoor
Doorbell_system = OpenDoor.OpenDoor()
Doorbell_system.InitializeGPIO()
#Open Door
#Input: True/False. True: Open door. False: Do nothing.
Result = Doorbell_system.open_door(3, True)
#Detect Button status
#Return “door_bell”, “verify_button”, “pass”
Status = Doorbell_system.event_from_rpi()