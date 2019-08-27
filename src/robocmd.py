import time
import sys
import math
from megapi import *

print("Bot init")
bot = MegaPi()

print("Bot start")
bot.start()

print("Bot listens")
while True:
    time.sleep(0.01)
    for line in sys.stdin:
        try:
            print("Bot got command '{}'".format(line))
            arr = line.split(',')
            cmdid = arr[0]
            motor = int(arr[1])
            if math.isnan(motor):
                motor = None
            val = float(arr[2])
            if math.isnan(val):
                val = 0
            if cmdid is not None and motor is not None and val is not None:
                bot.encoderMotorRun(motor, int(val*255))
                print('DONE,{}'.format(cmdid))
            else:
                print("Error!")
        except:
            print("An exception occurred") 