#!/bin/bash

#Export the ips that were used in the subnet to ipList.txt with arp which swept the subnet to get the ips' status.
arp -a|awk -F '(' '!/(incomplete)/{print $2}'|awk -F ')' '{print $1}' > ipList.txt

ipList=$(cat ipList.txt)

#Initiate the finalIps to record ips
finalIps=""

for ip in $ipList
do
    #If the device and the manager are in the same community, there will be a result which is not NULL
    result=$(snmpget -v1 -Cf -c ntu_public -t 0.02 $ip .1.3.6.1.2.1.1.3.0|awk '/Timeticks/{print $1}')
    if [ ${result} ];   then
        finalIps="${ip}\n${finalIps}"
    fi
done

#Export the finalIps to finalIplist.txt

echo -e ${finalIps}>finalIpList.txt

#Delete the last line
sed -i '' -e '$ d' finalIpList.txt
#Delete the last line
sed -i '' -e ' 1d' finalIpList.txt

cat finalIpList.txt