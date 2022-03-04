import os
import web
import requests
import json
import base64
import time
import face_recognition
import cv2
import numpy as np


class RPI_facereg:
    def __init__(self):
        self.owner_image = face_recognition.load_image_file("Rz.jpg")
        self.owner_face_encoding = face_recognition.face_encodings(self.owner_image, model="cnn")[0]
        self.known_face_encodings = [self.owner_face_encoding]
        self.known_face_names = ["RemannZ"]
    
    def POST(self):
        RPI_ID = '001'
        image_list = json.loads(json.loads(str(web.data(), encoding='utf -8')))['image_list']
        result=False
        owner_detect=[]
        face_locations=[]
        face_encodings=[]
        face_names=[]
        process_this_frame=True
        face_name_list=[]
        count_name={}
        for known in self.known_face_names:
            count_name[known]=0
        for i in image_list:
            img = np.array(bytearray(base64.b64decode(i)), dtype='uint8')
            img_decode=cv2.imdecode(img, cv2.IMREAD_COLOR)
            frame=img_decode
             # Convert the image from BGR color (which OpenCV uses) to RGB color(which face_recognition uses)
            rgb_small_frame = frame[:, : , : : -1]
             # Find all the faces and face encodings in the current frame of video
            face_locations=face_recognition.face_locations(rgb_small_frame,)
            face_encodings=face_recognition.face_encodings(rgb_small_frame, face_locations)
            face_names=[]
            for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
                matches=face_recognition.compare_faces(self.known_face_encodings,face_encoding)
                name="Unknown"
                face_distances=face_recognition.face_distance(self.known_face_encodings, face_encoding)
                best_match_index=np.argmin(face_distances)
                if matches[best_match_index]:
                    name=self.known_face_names[best_match_index]
                face_names.append(name)
             # print(face_names)
            for j in range(len(face_names)):
                face_name_list.append(face_names[j])
         # print(face_name_list)
        for j in set(face_name_list):
            count_name[j]=face_name_list.count(j)
        print(count_name)
        for _known in self.known_face_names:
            print((count_name[_known]/len(image_list)))
            if (count_name[_known]/len(image_list)) >= 0.9:
                result=True
                owner_detect.append(_known)
        return_json={'results': result, 'owner_detect': owner_detect}
        return_data=json.dumps(return_json, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
        return return_data
URL_facereg=("", "RPI_facereg")
app=web.application(URL_facereg, locals())
if __name__ == '__main__':
     print('[Debug] main')
     URL_facereg_main=("/", "RPI_facereg")
     app=web.application(URL_facereg_main, locals())
     app.run()
