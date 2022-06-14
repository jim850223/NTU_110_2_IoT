import os
import time
from wifi import Cell, Scheme
import json
import csv
import numpy as np

file_name = 'data.csv'
selected_AP = {'00:11:32:9d:30:3a':4, '00:11:32:9d:30:3b':5,
                '00:11:32:ad:8c:82':6, '00:11:32:ad:8c:83':7,
                '00:11:32:ad:8e:b7':8, '00:11:32:ad:8e:b8':9,
                '00:11:32:9D:2B:30':10, '00:11:32:9D:2B:31':11,
				}

def euclidian_distance(a, b):
    return np.linalg.norm((a-b),2)

def knn(position, feature, input, k,):

    distance = np.array([euclidian_distance(feature[i], input) for i in range(feature.shape[0]-1)])
    idx = np.argpartition(distance, k)
    prediction = np.mean(position[idx[:k]],axis=0)
    return  prediction

if __name__ == '__main__':
    start_time = time.time()
    stop_time = time.time()
    collect_time = input("Enter the time you want to collect(0~100):")
    #load data

    if os.path.exists(file_name):
        csvfile = open(file_name, 'r')
        rows = csv.reader(csvfile)

    train_feature = [] #AP RSSI
    train_position = [] #x,y,z
    index = 0
    for index,row in enumerate(rows):
        if index == 0:
            pass
        else:
          train_position.append(list(map(float, row[1:4])))
          train_feature.append(list(map(float, row[4:12])))

    train_feature = np.array(train_feature)
    train_position = np.array(train_position)

    #prediction
    while True:
        try:
            #os.system('sudo iwlist wlan0 scan')
            #cell = Cell.all('wlan0')
            information = [None, None, None, None, -90, -90, -90, -90, -90, -90, -90, -90, time.time()]
            '''
            for AP_SSID in cell:
              index = selected_AP.get(AP_SSID.address)
              if index is not None:
                information[index] = AP_SSID.signal
            '''
            prediction = knn(train_position, train_feature, np.array(information[4:12]), k=3)
            print('Predicted X: %.4f, Y:%.4f, Z: %.f' % (prediction[0], prediction[1], prediction[2]))
            stop_time = time.time()
            if (stop_time - start_time)>float(collect_time):
              break
        except KeyboardInterrupt:
            print('Hello user you have pressed ctrl-c button.')