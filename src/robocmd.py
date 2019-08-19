import sys
import time
#from megapi import *

print("robocmd.py started")

for line in sys.stdin:
    arr = line.split(',')
    id = arr[0]
    cmd = arr[1]
    time.sleep(2)
    print('DONE,{}'.format(id))


# def handleStop():
#         global bot
#         print("Wow")

# print("init")
# bot = MegaPi()

# print("start")
# bot.start()

# print("move")
# bot.encoderMotorMove(1, 200, 100, handleStop)
