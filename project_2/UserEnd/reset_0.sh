#!/bin/bash


cd ../ansible;sed -i '' "3s/.*/  hosts: pi_0/" Reset.yaml
ansible-playbook  Reset.yaml -i inventory.ini

