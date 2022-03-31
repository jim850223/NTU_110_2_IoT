#!/bin/bash


cd ../ansible;sed -i '' "3s/.*/  hosts: pi_0/" Update.yaml
ansible-playbook  Update.yaml -i inventory.ini

