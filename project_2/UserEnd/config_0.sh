#!/bin/bash


cd ../ansible;sed -i '' "3s/.*/  hosts: pi_0/" Test.yaml
ansible-playbook  Test.yaml -i inventory.ini

