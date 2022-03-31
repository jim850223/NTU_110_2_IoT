#!/bin/bash


cd ../ansible;sed -i '' "3s/.*/  hosts: pi_1/" Update.yaml
ansible-playbook  Update.yaml -i inventory.ini

