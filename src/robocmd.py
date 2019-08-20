import sys
import time
from megapi import *

print("robocmd.py started")

print("Bot init")
bot = MegaPi()

print("Bot start")
bot.start()

print("Bot listens")

for line in sys.stdin:
    arr = line.split(',')
    id = arr[0]
    cmd = arr[1]
    time.sleep(2)
    if cmd == "left":
        bot.encoderMotorRun(1, 200)
    elif cmd == "right":
        bot.encoderMotorRun(1, 200)
    elif cmd == "stop":
        bot.encoderMotorRun(1, 0)
        bot.encoderMotorRun(2, 0)
        bot.encoderMotorRun(3, 0)
        bot.encoderMotorRun(4, 0)
    print('DONE,{}'.format(id))

