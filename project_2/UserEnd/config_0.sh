#!/bin/bash


cd ../ansible;sed -i '' "3s/.*/  hosts: pi_0/" Upload.yaml
ansible-playbook  Upload.yaml -i inventory.ini

