#!/bin/bash

trap term_handler TERM

while [ -f "/home/pi/Desktop/app/main.py" 
do
	sudo python ~/Desktop/app/main.py
done
