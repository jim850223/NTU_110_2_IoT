import cv2
class VideoCap:
    def __init__(self):
        self.cap = None
        self.frame_now = None
        self.frame_group = []
        self.Statue_cap = 0
        for i in range(10):
            try:
                self.cap = cv2.VideoCapture(0)
                print('Video cap start...')
                self.Statue_cap = 1
            except:
                print('[Error] video capture have some error')
                self.Statue_cap = -1
                cv2.waitKey(500)
            else:
                print('Success!')
                break
    def get_some_frame(self, frame_num = 5):
        self.frame_group.clear()
        _, frame = self.cap.read()
        for i in range(frame_num):
            _, frame = self.cap.read()
            self.frame_group.append(frame)
            cv2.waitKey(10)
        return self.frame_group
    def release_cam(self):
        self.cap.release()