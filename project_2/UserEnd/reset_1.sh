#!/bin/bash


cd ../ansible;sed -i '' "3s/.*/  hosts: pi_1/" Reset.yaml
ansible-playbook  Reset.yaml -i inventory.ini

