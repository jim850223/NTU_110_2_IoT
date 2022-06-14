import os
import time
from wifi import Cell, Scheme
import json
import csv

position_index = input("Enter your position number(0~100):")
x = input("Enter the position at coordinate x:")
y = input("Enter the position at coordinate y:")
z = input("Enter the position at coordinate z:")
collect_time = input("Enter the time you want to collect(0~100):")
raw_data = []
selected_AP = {'00:11:32:9D:30:3A':4, '00:11:32:9D:30:3B':5,
                '00:11:32:AD:8C:82':6, '00:11:32:AD:8C:83':7,
                '00:11:32:AD:8E:B7':8, '00:11:32:AD:8E:B8':9,
                '00:11:32:9D:2B:30':10, '00:11:32:9D:2B:31':11,
				}

start_time = time.time()
stop_time = time.time()
file_name = 'data.csv'

#check file exit or not
if os.path.exists(file_name):
	csvfile = open(file_name, 'a',newline='')
	rows = csv.reader(csvfile)
	writer = csv.writer(csvfile)

else:
	csvfile = open(file_name, 'w',newline='')
	writer = csv.writer(csvfile)
	writer.writerow(['Position' , 'x', 'y', 'z', 'AP1_2.4G', 'AP1_5G', 
					'AP2_2.4G', 'AP2_5G', 'AP3_2.4G', 'AP3_5G',
					'AP4_2.4G', 'AP4_5G', 'time'])
while True:
	try:
		os.system('sudo iwlist wlan0 scan')
		cell = Cell.all('wlan0')
		information = [position_index, x, y, z, -90, -90, -90, -90, -90, -90, -90, -90, time.time()]
		for AP_SSID in cell:
			index = selected_AP.get(AP_SSID.address)
			if index is not None:
				information[index] = AP_SSID.signal
		writer.writerow(information)
		stop_time = time.time()
		
		if (stop_time - start_time)>float(collect_time):
			csvfile.close()
			break
		if -90 in information:
			print('-90 error')
			break
	except KeyboardInterrupt:
		print('Hello user you have pressed ctrl-c button.')
	
		
		
